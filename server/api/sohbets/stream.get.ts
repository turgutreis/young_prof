import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const reqHeaders = getHeaders(event)

  const key = (query.key as string || '').trim()
  const downloadMode = query.download === 'true'

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dateischlüssel (key) fehlt.'
    })
  }

  const fileName = key.split('/').pop() || 'sohbet-file'
  const ext = fileName.split('.').pop()?.toLowerCase()

  // Determine Content-Type based on extension
  let contentType = 'application/octet-stream'
  if (ext === 'pdf') contentType = 'application/pdf'
  else if (ext === 'mp3') contentType = 'audio/mpeg'
  else if (ext === 'm4a') contentType = 'audio/mp4'
  else if (ext === 'wav') contentType = 'audio/wav'
  else if (ext === 'ogg') contentType = 'audio/ogg'

  // If R2 credentials exist, fetch from S3 client with optional Range support
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

      const rangeHeader = reqHeaders.range

      const command = new GetObjectCommand({
        Bucket: config.r2BucketName,
        Key: key,
        Range: rangeHeader
      })

      const response = await s3Client.send(command)

      if (response.Body) {
        setHeader(event, 'Content-Type', response.ContentType || contentType)
        setHeader(event, 'Accept-Ranges', 'bytes')

        if (response.ContentRange) {
          setHeader(event, 'Content-Range', response.ContentRange)
          setResponseStatus(event, 206, 'Partial Content')
        }

        if (response.ContentLength) {
          setHeader(event, 'Content-Length', response.ContentLength)
        }
        
        const dispositionType = downloadMode ? 'attachment' : 'inline'
        setHeader(event, 'Content-Disposition', `${dispositionType}; filename="${encodeURIComponent(fileName)}"`)

        return sendStream(event, response.Body as Readable)
      }
    } catch (err: any) {
      console.error('R2 Audio/PDF Streaming Error:', err.message)
    }
  }

  // Fallback: Direct public R2 URL redirect
  const encodedKey = key.split('/').map(part => encodeURIComponent(part)).join('/')
  const fallbackUrl = `${config.r2PublicUrl.replace(/\/$/, '')}/${encodedKey}`

  return sendRedirect(event, fallbackUrl)
})
