import { H3Event } from 'h3'
import crypto from 'node:crypto'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface SessionPayload {
  role: 'admin'
  userId: string
  email: string
  iat: number
  exp: number
}

function getSigningSecret(config: any): string {
  const supabaseKey = config.supabaseKey || process.env.SUPABASE_KEY || 'sb_publishable_uGQJxk4gtX_Lw35UZXSpsA_qldd9t38'
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'yp-secure-salt-2026'
  return crypto.createHash('sha256').update(`${supabaseKey}:${sessionSecret}`).digest('hex')
}

export function createAdminSessionToken(user: { id: string; email?: string | null }, config: any): string {
  const secret = getSigningSecret(config)
  const now = Date.now()
  const payload: SessionPayload = {
    role: 'admin',
    userId: user.id,
    email: user.email || '',
    iat: now,
    exp: now + SESSION_DURATION_MS
  }

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex')

  return `${payloadB64}.${signature}`
}

export function verifySessionToken(token: string, config: any): SessionPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [payloadB64, signature] = parts
  if (!payloadB64 || !signature || !/^[0-9a-f]{64}$/i.test(signature)) return null

  try {
    const secret = getSigningSecret(config)
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex')

    const sigBuf = Buffer.from(signature, 'hex')
    const expBuf = Buffer.from(expectedSignature, 'hex')

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'))
    if (payload.role !== 'admin' || typeof payload.exp !== 'number' || !payload.userId) {
      return null
    }

    if (payload.exp <= Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function setAdminSessionCookie(event: H3Event, user: { id: string; email?: string | null }, config: any): void {
  const token = createAdminSessionToken(user, config)
  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true, // Inaccessible to JavaScript (XSS-safe)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    path: '/'
  })
}

export function clearAdminSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: '/'
  })
}

export function getAdminSession(event: H3Event): SessionPayload | null {
  const config = useRuntimeConfig()
  const token = getCookie(event, SESSION_COOKIE_NAME)
  if (!token) return null
  return verifySessionToken(token, config)
}

export function isAdminSessionValid(event: H3Event): boolean {
  return getAdminSession(event) !== null
}

export function verifyAdminSession(event: H3Event): SessionPayload {
  const session = getAdminSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkisiz erişim. Lütfen giriş yapın.'
    })
  }
  return session
}
