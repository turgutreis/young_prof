import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import type { SiteContent } from '~/types'
import { getInitialSiteContent } from '~/data/initial-content'

const CONTENT_FILE_KEY = 'site-content.json'

export function getS3Client(config: any) {
  if (!config.r2AccessKeyId || !config.r2SecretAccessKey) {
    return null
  }
  return new S3Client({
    region: 'auto',
    endpoint: config.r2Endpoint,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey
    }
  })
}

/**
 * Fetches the current site content JSON from Cloudflare R2.
 * If not yet created in R2, initializes R2 with initialSiteContent.
 */
export async function getSiteContentFromR2(config: any): Promise<SiteContent> {
  const s3Client = getS3Client(config)
  if (!s3Client) {
    return getInitialSiteContent()
  }

  try {
    const command = new GetObjectCommand({
      Bucket: config.r2BucketName,
      Key: CONTENT_FILE_KEY
    })
    const response = await s3Client.send(command)
    if (response.Body) {
      const text = await response.Body.transformToString()
      const parsed = JSON.parse(text)
      return parsed as SiteContent
    }
  } catch (err: any) {
    // If NoSuchKey, initialize R2 with initial content
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      const initial = getInitialSiteContent()
      try {
        await saveSiteContentToR2(config, initial)
      } catch (saveErr) {
        console.warn('Could not auto-save initial content.json to R2:', saveErr)
      }
      return initial
    }
    console.error('Error fetching site-content.json from R2:', err)
  }

  return getInitialSiteContent()
}

/**
 * Saves updated site content JSON to Cloudflare R2
 */
export async function saveSiteContentToR2(config: any, content: SiteContent): Promise<void> {
  const s3Client = getS3Client(config)
  if (!s3Client) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare R2 credentials not configured on server.'
    })
  }

  content.lastUpdated = new Date().toISOString()
  const body = Buffer.from(JSON.stringify(content, null, 2), 'utf-8')

  const command = new PutObjectCommand({
    Bucket: config.r2BucketName,
    Key: CONTENT_FILE_KEY,
    Body: body,
    ContentType: 'application/json'
  })

  await s3Client.send(command)
}

/**
 * Uploads a file (PDF or Image) directly to Cloudflare R2
 */
export async function uploadFileToR2(
  config: any,
  key: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const s3Client = getS3Client(config)
  if (!s3Client) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare R2 credentials not configured on server.'
    })
  }

  const cleanKey = key.replace(/^\//, '')

  const command = new PutObjectCommand({
    Bucket: config.r2BucketName,
    Key: cleanKey,
    Body: data,
    ContentType: contentType
  })

  await s3Client.send(command)
  return cleanKey
}
