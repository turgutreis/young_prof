import { clearAdminSessionCookie } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  clearAdminSessionCookie(event)

  return {
    success: true,
    message: 'Çıkış yapıldı.'
  }
})
