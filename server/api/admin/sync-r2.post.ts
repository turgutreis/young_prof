import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getS3Client, formatTurkishTitle } from '~/server/utils/r2'
import type { CurriculumTopic, CurriculumFile } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const reqHeaders = getHeaders(event)
  const cookiePassword = getCookie(event, 'admin_session')
  const authHeader = reqHeaders['x-admin-password']
  const expectedPassword = config.adminPassword?.trim()

  if ((authHeader !== expectedPassword) && (cookiePassword !== expectedPassword)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Yetkisiz erişim. Lütfen giriş yapın.'
    })
  }

  const s3Client = getS3Client(config)
  if (!s3Client) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare R2 bilgileri tanımlanmamış.'
    })
  }

  try {
    let isTruncated = true
    let continuationToken: string | undefined = undefined
    const allObjects: Array<{ key: string; size?: number; lastModified?: Date }> = []

    while (isTruncated) {
      const command: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: config.r2BucketName,
        Prefix: 'files/',
        ContinuationToken: continuationToken
      })

      const response = await s3Client.send(command)
      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key && !item.Key.endsWith('/')) {
            allObjects.push({
              key: item.Key,
              size: item.Size,
              lastModified: item.LastModified
            })
          }
        }
      }
      isTruncated = response.IsTruncated || false
      continuationToken = response.NextContinuationToken
    }

    // Group objects by folder (e.g. files/01-sohbet-i-canan)
    const folderMap = new Map<string, CurriculumFile[]>()

    for (const obj of allObjects) {
      const parts = obj.key.split('/')
      if (parts.length >= 3) {
        const folderSlug = parts[1] // e.g. 01-sohbet-i-canan or 23-kuran-okuma
        const fileName = parts.slice(2).join('/')
        const title = formatFileTitle(fileName)
        const streamUrl = `/api/sohbets/stream?key=${encodeURIComponent(obj.key)}`

        if (!folderMap.has(folderSlug)) {
          folderMap.set(folderSlug, [])
        }

        folderMap.get(folderSlug)!.push({
          title,
          href: streamUrl
        })
      }
    }

    const discoveredTopics: CurriculumTopic[] = []

    for (const [folderSlug, files] of folderMap.entries()) {
      const { no, title } = parseFolderSlug(folderSlug)
      discoveredTopics.push({
        no,
        title,
        files: sortTopicFiles(files)
      })
    }

    // Sort topics by topic number
    discoveredTopics.sort((a, b) => {
      const numA = parseInt(a.no, 10)
      const numB = parseInt(b.no, 10)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.no.localeCompare(b.no)
    })

    return {
      success: true,
      totalFiles: allObjects.length,
      topicsCount: discoveredTopics.length,
      topics: discoveredTopics
    }
  } catch (err: any) {
    console.error('Error scanning R2 bucket:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `R2 tarama hatası: ${err.message || 'Bilinmeyen hata'}`
    })
  }
})

function formatFileTitle(fileName: string): string {
  const lower = fileName.toLowerCase()
  if (lower.includes('ana-calisma') || lower.includes('ana_calisma') || lower.includes('ana calisma')) {
    return 'Ana Çalışma Metni'
  }
  if (lower.includes('handout-1')) return 'Handout 1'
  if (lower.includes('handout-2')) return 'Handout 2'
  if (lower.includes('handout')) return 'Handout'
  if (lower.includes('sunum-1')) return 'Sunum 1'
  if (lower.includes('sunum-2')) return 'Sunum 2'
  if (lower.includes('sunum')) return 'Sunum'
  if (lower.includes('kahoot')) return 'Kahoot! Soruları'
  if (lower.includes('ozet')) return 'Özet'
  if (lower.includes('sorularla-anlatim')) return 'Sorularla Anlatım'
  if (lower.includes('sorular')) return 'Sorular'
  if (lower.includes('videolar')) return 'Videolar'
  if (lower.includes('21-lema')) return '21. Lem’a – İhlas Risalesi'

  // Default: remove extension and capitalize words
  const base = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  return base.charAt(0).toUpperCase() + base.slice(1)
}

function parseFolderSlug(slug: string): { no: string; title: string } {
  const match = slug.match(/^(\d+)[-_ ]*(.*)$/)
  if (match) {
    const no = match[1].padStart(2, '0')
    const rawTitle = match[2].replace(/[-_]/g, ' ').trim()
    const title = rawTitle ? formatTurkishTitle(rawTitle) : `Konu ${no}`
    return { no, title }
  }

  // Non-numbered folder (e.g. kurban, ramazan)
  const title = formatTurkishTitle(slug.replace(/[-_]/g, ' '))
  return { no: '✦', title }
}

function sortTopicFiles(files: CurriculumFile[]): CurriculumFile[] {
  const priority = [
    'Ana Çalışma Metni',
    'Handout',
    'Handout 1',
    'Handout 2',
    'Özet',
    'Sunum',
    'Sunum 1',
    'Sunum 2',
    'Kahoot! Soruları',
    'Sorularla Anlatım',
    'Sorular',
    'Videolar'
  ]

  return [...files].sort((a, b) => {
    const indexA = priority.indexOf(a.title)
    const indexB = priority.indexOf(b.title)
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    return a.title.localeCompare(b.title)
  })
}
