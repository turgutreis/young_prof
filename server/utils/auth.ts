import { H3Event } from 'h3'
import crypto from 'node:crypto'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface SessionPayload {
  role: 'admin'
  iat: number
  exp: number
}

function getSigningSecret(config: any): string {
  const adminPassword = config.adminPassword || 'young2026admin'
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'yp-secure-salt-2026'
  return crypto.createHash('sha256').update(`${adminPassword}:${sessionSecret}`).digest('hex')
}

export function createAdminSessionToken(config: any): string {
  const secret = getSigningSecret(config)
  const now = Date.now()
  const payload: SessionPayload = {
    role: 'admin',
    iat: now,
    exp: now + SESSION_DURATION_MS
  }

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex')

  return `${payloadB64}.${signature}`
}

export function verifySessionToken(token: string, config: any): boolean {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payloadB64, signature] = parts
  if (!payloadB64 || !signature || !/^[0-9a-f]{64}$/i.test(signature)) return false

  try {
    const secret = getSigningSecret(config)
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('hex')

    const sigBuf = Buffer.from(signature, 'hex')
    const expBuf = Buffer.from(expectedSignature, 'hex')

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return false
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'))
    if (payload.role !== 'admin' || typeof payload.exp !== 'number') {
      return false
    }

    return payload.exp > Date.now()
  } catch {
    return false
  }
}

export function setAdminSessionCookie(event: H3Event, config: any): void {
  const token = createAdminSessionToken(config)
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

export function isAdminSessionValid(event: H3Event): boolean {
  const config = useRuntimeConfig()
  const token = getCookie(event, SESSION_COOKIE_NAME)
  if (!token) return false
  return verifySessionToken(token, config)
}

export function verifyAdminSession(event: H3Event): void {
  if (!isAdminSessionValid(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkisiz erişim. Lütfen giriş yapın.'
    })
  }
}
