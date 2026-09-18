import { getSiteContentFromR2 } from '~/server/utils/r2'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  try {
    const content = await getSiteContentFromR2(config)
    setHeader(event, 'Cache-Control', 'public, max-age=10, s-maxage=30, stale-while-revalidate=60')
    return content
  } catch (err: any) {
    console.error('Failed to load content from R2:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'İçerik yüklenirken bir hata oluştu.'
    })
  }
})
