import { saveSiteContentToR2 } from '~/server/utils/r2'
import type { SiteContent } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const reqHeaders = getHeaders(event)
  const cookiePassword = getCookie(event, 'admin_session')
  const authHeader = reqHeaders['x-admin-password']

  const expectedPassword = config.adminPassword?.trim()

  if ((authHeader !== expectedPassword) && (cookiePassword !== expectedPassword)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkisiz erişim. Lütfen giriş yapın.'
    })
  }

  const body = await readBody<SiteContent>(event)

  if (!body || !body.categories || !body.curriculumTopics) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz içerik verisi.'
    })
  }

  try {
    await saveSiteContentToR2(config, body)
    return {
      success: true,
      message: 'Tüm içerikler başarıyla Cloudflare R2 üzerinde güncellendi.'
    }
  } catch (err: any) {
    console.error('Failed to save content to R2:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Kaydetme hatası: ${err.message || 'Bilinmeyen hata'}`
    })
  }
})
