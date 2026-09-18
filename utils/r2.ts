import type { CurriculumFile, CurriculumTopic } from '~/types'

/**
 * Builds the URL to stream or download a file from Cloudflare R2 via the server proxy
 */
export function getR2Url(key: string, download = false): string {
  const cleanKey = key.replace(/^\//, '')
  return `/api/sohbets/stream?key=${encodeURIComponent(cleanKey)}${download ? '&download=true' : ''}`
}

/**
 * Numerically sorts an array of curriculum topics by their 'no' property.
 * Handles numbers ('01', '23'), alphanumerics ('02a'), and symbols cleanly.
 */
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

export interface TopicFileOptions {
  /** Include standard 'Ana Çalışma Metni' (default: true) */
  anaMetin?: boolean
  /** Include standard 'Handout' (default: true) */
  handout?: boolean
  /** Include standard 'Sunum' (default: true) */
  sunum?: boolean
  /** Include standard 'Kahoot! Soruları' (default: true) */
  kahoot?: boolean
  /** Include 'Özet' (default: false) */
  ozet?: boolean
  /** Specific custom files or additional files for this topic */
  customFiles?: Array<{ title: string; filename: string }>
}

/**
 * Helper to generate a topic's file array cleanly without boilerplate.
 * By default includes:
 * - Ana Çalışma Metni (ana-calisma-metni.pdf)
 * - Handout (handout.pdf)
 * - Sunum (sunum.pdf)
 * - Kahoot! Soruları (kahoot.pdf)
 *
 * @example
 * createTopicFiles('kurban')
 * createTopicFiles('20-is-yogunlugu-namaz-hirsizligi', { ozet: true, handout: false })
 */
export function createTopicFiles(
  folderSlug: string,
  options: TopicFileOptions = {}
): CurriculumFile[] {
  const {
    anaMetin = true,
    handout = true,
    sunum = true,
    kahoot = true,
    ozet = false,
    customFiles = []
  } = options

  const files: CurriculumFile[] = []
  const folder = folderSlug.replace(/^\/|files\//g, '').replace(/\/$/, '')

  if (anaMetin) {
    files.push({
      title: 'Ana Çalışma Metni',
      href: getR2Url(`files/${folder}/ana-calisma-metni.pdf`)
    })
  }

  if (ozet) {
    files.push({
      title: 'Özet',
      href: getR2Url(`files/${folder}/ozet.pdf`)
    })
  }

  if (handout) {
    files.push({
      title: 'Handout',
      href: getR2Url(`files/${folder}/handout.pdf`)
    })
  }

  if (sunum) {
    files.push({
      title: 'Sunum',
      href: getR2Url(`files/${folder}/sunum.pdf`)
    })
  }

  if (kahoot) {
    files.push({
      title: 'Kahoot! Soruları',
      href: getR2Url(`files/${folder}/kahoot.pdf`)
    })
  }

  if (customFiles.length > 0) {
    for (const item of customFiles) {
      files.push({
        title: item.title,
        href: getR2Url(`files/${folder}/${item.filename}`)
      })
    }
  }

  return files
}
