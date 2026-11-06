import { isAdminSessionValid, clearAdminSessionCookie } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const isValid = isAdminSessionValid(event)

  if (!isValid) {
    clearAdminSessionCookie(event)
    return {
      authenticated: false
    }
  }

  return {
    authenticated: true
  }
})
