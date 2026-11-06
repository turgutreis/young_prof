import { saveSiteContentToR2 } from '~/server/utils/r2'
import { verifyAdminSession } from '~/server/utils/auth'
import type { SiteContent } from '~/types'

export default defineEventHandler(async (event) => {
  verifyAdminSession(event)

  const config = useRuntimeConfig()

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
