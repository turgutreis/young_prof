import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const key = (query.key as string || '').trim()
  const downloadMode = query.download === 'true'

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dateischlüssel (key) fehlt.'
    })
  }

  const fileName = key.split('/').pop() || 'sohbet.pdf'

  // If R2 credentials are set, fetch directly via S3 Client and stream with proper headers
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

      const response = await s3Client.send(command)

      if (response.Body) {
        setHeader(event, 'Content-Type', response.ContentType || 'application/pdf')
        if (response.ContentLength) {
          setHeader(event, 'Content-Length', response.ContentLength)
        }
        
        const dispositionType = downloadMode ? 'attachment' : 'inline'
        setHeader(event, 'Content-Disposition', `${dispositionType}; filename="${encodeURIComponent(fileName)}"`)

        return sendStream(event, response.Body as Readable)
      }
    } catch (err: any) {
      console.error('R2 Streaming Error:', err.message)
    }
  }

  // Fallback: If no credentials are set, redirect or serve sample PDF stream for testing
  const encodedKey = key.split('/').map(part => encodeURIComponent(part)).join('/')
  const fallbackUrl = `${config.r2PublicUrl.replace(/\/$/, '')}/${encodedKey}`

  return sendRedirect(event, fallbackUrl)
})
