import { setAdminSessionCookie } from '~/server/utils/auth'

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

  // Set secure, cryptographically signed HttpOnly session cookie
  setAdminSessionCookie(event, config)

  return {
    success: true,
    message: 'Giriş başarılı.'
  }
})
