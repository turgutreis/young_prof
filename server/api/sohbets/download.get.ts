import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const key = (query.key as string || '').trim()

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing file key parameter'
    })
  }

  // If R2 credentials exist, attempt presigned download URL generation or proxy redirect
  if (config.r2AccessKeyId && config.r2SecretAccessKey) {
    try {
      const s3Client = new S3Client({
        region: 'auto',
        endpoint: config.r2Endpoint,
        credentials: {
          accessKeyId: config.r2AccessKeyId,
          secretAccessKey: config.r2SecretAccessKey
        }
      })

      const command = new GetObjectCommand({
        Bucket: config.r2BucketName,
        Key: key
      })

      // Generate a signed URL valid for 1 hour
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
      return sendRedirect(event, signedUrl)
    } catch (err: any) {
      console.warn('Presigned URL generation error, falling back to public URL:', err.message)
    }
  }

  // Direct R2 bucket public endpoint fallback
  const encodedKey = key.split('/').map(part => encodeURIComponent(part)).join('/')
  const publicUrl = `${config.r2PublicUrl.replace(/\/$/, '')}/${encodedKey}`
  
  return sendRedirect(event, publicUrl)
})
