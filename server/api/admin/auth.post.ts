import { setAdminSessionCookie } from '~/server/utils/auth'
import { getSupabaseServerClient } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const email = body?.email?.trim()
  const password = body?.password?.trim()

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'E-posta ve şifre zorunludur.'
    })
  }

  const supabase = getSupabaseServerClient(config)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.'
    })
  }

  // Set secure, cryptographically signed HttpOnly session cookie
  setAdminSessionCookie(event, { id: data.user.id, email: data.user.email }, config)

  return {
    success: true,
    message: 'Giriş başarılı.',
    user: {
      id: data.user.id,
      email: data.user.email
    }
  }
})
