import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export interface SohbetFile {
  key: string
  name: string
  folderPath: string
  size: number
  lastModified: string
  downloadUrl: string
  previewUrl?: string
  category: string
  subCategory: string
  hasAudio: boolean
  hasPdf: boolean
  audioUrl?: string
  audioKey?: string
  durationLabel?: string
}

export interface FolderNode {
  name: string
  fullPath: string
  children: FolderNode[]
  filesCount: number
}

// Fallback dataset used ONLY if R2 API keys are not configured in .env
const MOCK_FILES: SohbetFile[] = [
  {
    key: 'sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/01_Namazin_Onemi_ve_Ibadet.pdf',
    name: '01 - Namazın Önemi ve İbadetin Kazandırdıkları.pdf',
    folderPath: 'sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/',
    size: 2450000,
    lastModified: '2026-07-28T14:30:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/01_Namazin_Onemi_ve_Ibadet.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/01_Namazin_Onemi_ve_Ibadet.pdf'),
    category: 'INT - SYF - GENCLIK MFRDT',
    subCategory: 'A - NAMAZ IBADETİ VE KAZANDIRDIKLARI',
    hasPdf: true,
    hasAudio: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    durationLabel: '14:20 Min.'
  },
  {
    key: 'sohbets/Music/01_Testhalb_Audio.mp3',
    name: '01 - Testhalb Audio Sohbet.mp3',
    folderPath: 'sohbets/Music/',
    size: 5200000,
    lastModified: '2026-08-06T10:00:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/Music/01_Testhalb_Audio.mp3'),
    category: 'Music',
    subCategory: 'Audio',
    hasPdf: false,
    hasAudio: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    durationLabel: '12:30 Min.'
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  const search = (query.search as string || '').toLowerCase().trim()
  let pathPrefix = (query.path as string || '').trim()
  const audioOnlyFilter = query.audioOnly === 'true'

  // Ensure pathPrefix ends with '/' if not empty
  if (pathPrefix && !pathPrefix.endsWith('/')) {
    pathPrefix += '/'
  }

  let files: SohbetFile[] = []
  let subFolders: FolderNode[] = []
  let isLiveR2Data = false

  // 1. REAL LIVE CLOUDFLARE R2 S3 API QUERY
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

      // Query R2 with Delimiter: '/' to get true folder hierarchy & files at current level
      const command = new ListObjectsV2Command({
        Bucket: config.r2BucketName,
        Prefix: pathPrefix,
        Delimiter: '/'
      })

      const response = await s3Client.send(command)
      isLiveR2Data = true

      // Parse Real Subfolders from R2 CommonPrefixes
      if (response.CommonPrefixes) {
        subFolders = response.CommonPrefixes
          .filter(cp => cp.Prefix)
          .map(cp => {
            const fullPath = cp.Prefix!
            const cleanPath = fullPath.replace(/\/$/, '')
            const folderName = cleanPath.split('/').pop() || cleanPath

            return {
              name: folderName,
              fullPath,
              children: [],
              filesCount: 0
            }
          })
      }

      // Parse Real Files at current folder level from R2 Contents
      if (response.Contents) {
        const pdfMap = new Map<string, any>()
        const audioMap = new Map<string, any>()

        response.Contents.forEach(item => {
          if (!item.Key || item.Key === pathPrefix) return
          const ext = item.Key.substring(item.Key.lastIndexOf('.')).toLowerCase()
          const baseKey = item.Key.substring(0, item.Key.lastIndexOf('.'))

          if (ext === '.pdf') {
            pdfMap.set(baseKey, item)
          } else if (['.mp3', '.m4a', '.wav', '.ogg'].includes(ext)) {
            audioMap.set(baseKey, item)
          }
        })

        const processedKeys = new Set<string>()

        pdfMap.forEach((item, baseKey) => {
          processedKeys.add(baseKey)
          const key = item.Key!
          const parts = key.split('/')
          const fileName = parts[parts.length - 1]
          const folderPath = key.substring(0, key.lastIndexOf('/') + 1)
          
          const category = parts.length > 2 ? parts[1] : 'Genel'
          const subCategory = parts.length > 3 ? parts[2] : 'Genel'

          const matchingAudioItem = audioMap.get(baseKey)
          const hasAudio = !!matchingAudioItem
          const audioUrl = matchingAudioItem ? `/api/sohbets/stream?key=${encodeURIComponent(matchingAudioItem.Key!)}` : undefined

          files.push({
            key,
            name: fileName,
            folderPath,
            size: item.Size || 0,
            lastModified: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString(),
            downloadUrl: `/api/sohbets/stream?download=true&key=${encodeURIComponent(key)}`,
            previewUrl: `/api/sohbets/stream?key=${encodeURIComponent(key)}`,
            category,
            subCategory,
            hasPdf: true,
            hasAudio,
            audioUrl,
            audioKey: matchingAudioItem?.Key,
            durationLabel: hasAudio ? 'Audio & PDF' : 'PDF'
          })
        })

        audioMap.forEach((item, baseKey) => {
          if (!processedKeys.has(baseKey)) {
            const key = item.Key!
            const parts = key.split('/')
            const fileName = parts[parts.length - 1]
            const folderPath = key.substring(0, key.lastIndexOf('/') + 1)
            
            const category = parts.length > 2 ? parts[1] : 'Genel'
            const subCategory = parts.length > 3 ? parts[2] : 'Genel'

            const audioUrl = `/api/sohbets/stream?key=${encodeURIComponent(key)}`

            files.push({
              key,
              name: fileName,
              folderPath,
              size: item.Size || 0,
              lastModified: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString(),
              downloadUrl: `/api/sohbets/stream?download=true&key=${encodeURIComponent(key)}`,
              category,
              subCategory,
              hasPdf: false,
              hasAudio: true,
              audioUrl,
              audioKey: key,
              durationLabel: 'Audio Track'
            })
          }
        })
      }
    } catch (err: any) {
      console.warn('R2 S3 API error:', err.message)
    }
  }

  // 2. FALLBACK ONLY IF R2 KEYS ARE NOT IN .ENV
  if (!isLiveR2Data) {
    let sourceFiles = MOCK_FILES

    if (pathPrefix) {
      sourceFiles = sourceFiles.filter(f => f.folderPath.startsWith(pathPrefix) || f.key.startsWith(pathPrefix))
    }

    files = sourceFiles.filter(f => f.folderPath === pathPrefix || (!pathPrefix && f.folderPath.split('/').filter(Boolean).length <= 1))

    // Build subfolders for fallback
    const folderMap = new Map<string, FolderNode>()
    sourceFiles.forEach(f => {
      if (f.folderPath.startsWith(pathPrefix) && f.folderPath !== pathPrefix) {
        const relativePath = f.folderPath.substring(pathPrefix.length)
        const firstSegment = relativePath.split('/')[0]
        if (firstSegment) {
          const fullPath = `${pathPrefix}${firstSegment}/`
          if (!folderMap.has(fullPath)) {
            folderMap.set(fullPath, {
              name: firstSegment,
              fullPath,
              children: [],
              filesCount: 0
            })
          }
          folderMap.get(fullPath)!.filesCount++
        }
      }
    })
    subFolders = Array.from(folderMap.values())
  }

  // Filter Audio Only
  if (audioOnlyFilter) {
    files = files.filter(f => f.hasAudio)
  }

  // Search Filter
  if (search) {
    files = files.filter(f => 
      f.name.toLowerCase().includes(search) ||
      f.folderPath.toLowerCase().includes(search) ||
      f.category.toLowerCase().includes(search) ||
      f.subCategory.toLowerCase().includes(search)
    )
  }

  return {
    success: true,
    isLiveR2Data,
    currentPath: pathPrefix,
    totalFiles: files.length,
    files,
    subFolders
  }
})
