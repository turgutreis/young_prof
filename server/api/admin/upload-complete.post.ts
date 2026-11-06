import { GetObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { getS3Client, uploadFileToR2 } from '~/server/utils/r2'
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

  const body = await readBody(event)
  const { uploadId, totalChunks, folder = 'files/uploads', filename, contentType = 'application/pdf' } = body || {}

  if (!uploadId || !totalChunks || !filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tamamlama parametreleri eksik (uploadId, totalChunks, filename).'
    })
  }

  const cleanUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, '')
  const cleanFolder = folder.replace(/^\/|\/$/g, '')

  // Determine sanitized target filename
  let targetName = filename.toLowerCase().replace(/[^a-z0-9.-]/g, '-').replace(/-+/g, '-')
  const targetKey = `${cleanFolder}/${targetName}`

  try {
    // 1. Fetch and assemble all chunks in order
    const chunkBuffers: Buffer[] = []
    const chunkKeys: Array<{ Key: string }> = []

    for (let i = 0; i < totalChunks; i++) {
      const chunkKey = `temp-chunks/${cleanUploadId}/chunk-${i}`
      chunkKeys.push({ Key: chunkKey })

      const res = await s3Client.send(new GetObjectCommand({
        Bucket: config.r2BucketName,
        Key: chunkKey
      }))

      if (!res.Body) {
        throw new Error(`Parça ${i} okunamadı.`)
      }

      const bytes = await res.Body.transformToByteArray()
      chunkBuffers.push(Buffer.from(bytes))
    }

    const finalBuffer = Buffer.concat(chunkBuffers)

    // 2. Upload final assembled file to target R2 key
    const uploadedKey = await uploadFileToR2(config, targetKey, finalBuffer, contentType)
    const streamUrl = `/api/sohbets/stream?key=${encodeURIComponent(uploadedKey)}`

    // 3. Clean up temporary chunks asynchronously
    if (chunkKeys.length > 0) {
      s3Client.send(new DeleteObjectsCommand({
        Bucket: config.r2BucketName,
        Delete: { Objects: chunkKeys }
      })).catch(err => {
        console.warn('Temporary chunks cleanup warning:', err.message)
      })
    }

    return {
      success: true,
      key: uploadedKey,
      href: streamUrl,
      fileName: targetName,
      size: finalBuffer.length
    }
  } catch (err: any) {
    console.error('Failed to complete chunked upload:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Dosya birleştirme hatası: ${err.message || 'Bilinmeyen hata'}`
    })
  }
})
