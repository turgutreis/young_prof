import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import type { SiteContent, CurriculumTopic } from '~/types'
import { getInitialSiteContent } from '~/data/initial-content'

const CONTENT_FILE_KEY = 'site-content.json'

export function sortCurriculumTopics(topics: CurriculumTopic[]): CurriculumTopic[] {
  if (!topics || !Array.isArray(topics)) return []
  return [...topics].sort((a, b) => {
    const cleanA = (a.no || '').trim()
    const cleanB = (b.no || '').trim()

    const matchA = cleanA.match(/^(\d+)/)
    const matchB = cleanB.match(/^(\d+)/)

    if (matchA && matchB) {
      const numA = parseInt(matchA[1], 10)
      const numB = parseInt(matchB[1], 10)
      if (numA !== numB) {
        return numA - numB
      }
      return cleanA.localeCompare(cleanB, undefined, { numeric: true, sensitivity: 'base' })
    }

    if (matchA) return -1
    if (matchB) return 1

    return cleanA.localeCompare(cleanB, undefined, { numeric: true, sensitivity: 'base' })
  })
}

/**
 * Transforms Turkish strings into beautiful Turkish Title Case
 */
export function formatTurkishTitle(input: string): string {
  if (!input) return ''

  const str = input
    .replace(/KUR_AN/gi, "Kur’an")
    .replace(/KUR-AN/gi, "Kur’an")
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const lowerConjunctions = new Set(['ve', 'ile', 'veya', 'de', 'da', 'ki', 'için', 'ya', 'yahut'])

  const words = str.split(' ')
  const formattedWords = words.map((word, index) => {
    if (!word) return ''

    const lowerWord = word.toLocaleLowerCase('tr-TR')

    if (index > 0 && lowerConjunctions.has(lowerWord)) {
      return lowerWord
    }

    if (/^kur['’`]?an/i.test(word)) {
      return word.replace(/^kur['’`]?an/i, 'Kur’an')
    }
    if (/^allah/i.test(word)) {
      return word.replace(/^allah/i, 'Allah')
    }

    const firstChar = word.charAt(0).toLocaleUpperCase('tr-TR')
    const restChars = word.slice(1).toLocaleLowerCase('tr-TR')
    return firstChar + restChars
  })

  return formattedWords.join(' ')
}

export function normalizeSiteContent(content: SiteContent): SiteContent {
  if (content && content.curriculumTopics) {
    for (const step of Object.keys(content.curriculumTopics)) {
      if (Array.isArray((content.curriculumTopics as any)[step])) {
        ;(content.curriculumTopics as any)[step] = sortCurriculumTopics((content.curriculumTopics as any)[step])
      }
    }
  }
  return content
}

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
      return normalizeSiteContent(parsed as SiteContent)
    }
  } catch (err: any) {
    // If NoSuchKey, initialize R2 with initial content
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      const initial = normalizeSiteContent(getInitialSiteContent())
      try {
        await saveSiteContentToR2(config, initial)
      } catch (saveErr) {
        console.warn('Could not auto-save initial content.json to R2:', saveErr)
      }
      return initial
    }
    console.error('Error fetching site-content.json from R2:', err)
  }

  return normalizeSiteContent(getInitialSiteContent())
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

  normalizeSiteContent(content)
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
