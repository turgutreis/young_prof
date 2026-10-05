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
  else if (ext === 'png') contentType = 'image/png'
  else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
  else if (ext === 'webp') contentType = 'image/webp'
  else if (ext === 'svg') contentType = 'image/svg+xml'

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

      // Helper function to try fetching an S3 key
      const tryFetchObject = async (candidateKey: string) => {
        const command = new GetObjectCommand({
          Bucket: config.r2BucketName,
          Key: candidateKey,
          Range: rangeHeader
        })
        return await s3Client.send(command)
      }

      // Generate candidate keys to handle Unicode normalization, alternate extensions, etc.
      const candidateKeys = [
        key,
        decodeURIComponent(key),
        key.normalize('NFC'),
        key.normalize('NFD')
      ]

      // If requested file is a .pdf, also try alternative image extensions in case the handout was an image
      if (ext === 'pdf') {
        const baseKey = key.replace(/\.pdf$/i, '')
        candidateKeys.push(
          `${baseKey}.png`,
          `${baseKey}.jpg`,
          `${baseKey}.jpeg`,
          `${baseKey}.webp`
        )
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        const baseKey = key.replace(/\.(png|jpg|jpeg|webp)$/i, '')
        candidateKeys.push(`${baseKey}.pdf`)
      }

      const uniqueKeys = Array.from(new Set(candidateKeys))

      let response: any = null
      let matchedKey = key

      for (const candKey of uniqueKeys) {
        try {
          const res = await tryFetchObject(candKey)
          if (res?.Body) {
            response = res
            matchedKey = candKey
            break
          }
        } catch {
          // Continue to next candidate
        }
      }

      if (response && response.Body) {
        const effectiveFileName = matchedKey.split('/').pop() || fileName
        const effectiveExt = effectiveFileName.split('.').pop()?.toLowerCase()
        let effectiveContentType = contentType

        if (effectiveExt === 'pdf') effectiveContentType = 'application/pdf'
        else if (effectiveExt === 'png') effectiveContentType = 'image/png'
        else if (effectiveExt === 'jpg' || effectiveExt === 'jpeg') effectiveContentType = 'image/jpeg'
        else if (effectiveExt === 'webp') effectiveContentType = 'image/webp'
        else if (effectiveExt === 'mp3') effectiveContentType = 'audio/mpeg'
        else if (effectiveExt === 'm4a') effectiveContentType = 'audio/mp4'

        setHeader(event, 'Content-Type', response.ContentType || effectiveContentType)
        setHeader(event, 'Accept-Ranges', 'bytes')
        setHeader(event, 'X-Content-Type-Options', 'nosniff')

        if (response.ContentRange) {
          setHeader(event, 'Content-Range', response.ContentRange)
          setResponseStatus(event, 206, 'Partial Content')
        }

        if (response.ContentLength) {
          setHeader(event, 'Content-Length', response.ContentLength)
        }

        const dispositionType = downloadMode ? 'attachment' : 'inline'
        setHeader(event, 'Content-Disposition', `${dispositionType}; filename="${encodeURIComponent(effectiveFileName)}"`)

        return sendStream(event, response.Body as Readable)
      }
    } catch (err: any) {
      console.error('R2 Audio/PDF Streaming Error:', err.message)
    }
  }

  // Fallback: If public R2 URL is explicitly configured as absolute URL, redirect there
  if (config.r2PublicUrl && typeof config.r2PublicUrl === 'string' && config.r2PublicUrl.startsWith('http')) {
    const encodedKey = key.split('/').map(part => encodeURIComponent(part)).join('/')
    const fallbackUrl = `${config.r2PublicUrl.replace(/\/$/, '')}/${encodedKey}`
    return sendRedirect(event, fallbackUrl)
  }

  // Return clean 404 (NEVER relative-redirect to a nonexistent route which breaks iframes)
  throw createError({
    statusCode: 404,
    statusMessage: 'Dosya Cloudflare R2 üzerinde bulunamadı.'
  })
})
