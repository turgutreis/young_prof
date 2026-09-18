export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const enteredPassword = body?.password?.trim()
  const expectedPassword = config.adminPassword?.trim()

  if (!enteredPassword || enteredPassword !== expectedPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Geçersiz yönetici şifresi.'
    })
  }

  // Set session cookie
  setCookie(event, 'admin_session', enteredPassword, {
    httpOnly: false, // Accessible from client script for auth header fallback
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    success: true,
    message: 'Giriş başarılı.'
  }
})
