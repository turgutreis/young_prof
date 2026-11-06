import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client } from '~/server/utils/r2'
import { verifyAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  verifyAdminSession(event)

  const config = useRuntimeConfig()

  const s3Client = getS3Client(config)
  if (!s3Client) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare R2 bilgileri tanımlanmamış.'
    })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yüklenecek parça verisi bulunamadı.'
    })
  }

  let uploadId = ''
  let chunkIndex = -1
  let chunkData: Buffer | null = null

  for (const item of formData) {
    if (item.name === 'uploadId' && item.data) {
      uploadId = item.data.toString('utf-8').trim()
    } else if (item.name === 'chunkIndex' && item.data) {
      chunkIndex = parseInt(item.data.toString('utf-8').trim(), 10)
    } else if (item.name === 'chunk' && item.data) {
      chunkData = item.data
    }
  }

  if (!uploadId || chunkIndex < 0 || !chunkData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parça parametreleri eksik (uploadId, chunkIndex veya chunk).'
    })
  }

  const cleanUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, '')
  const chunkKey = `temp-chunks/${cleanUploadId}/chunk-${chunkIndex}`

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: config.r2BucketName,
      Key: chunkKey,
      Body: chunkData,
      ContentType: 'application/octet-stream'
    }))

    return {
      success: true,
      chunkIndex
    }
  } catch (err: any) {
    console.error('Failed to save chunk to R2:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Parça yükleme hatası: ${err.message || 'Bilinmeyen hata'}`
    })
  }
})
