import { getAdminSession, clearAdminSessionCookie } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = getAdminSession(event)

  if (!session) {
    clearAdminSessionCookie(event)
    return {
      authenticated: false
    }
  }

  return {
    authenticated: true,
    user: {
      userId: session.userId,
      email: session.email
    }
  }
})
