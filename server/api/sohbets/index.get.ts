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

// Sample audio for development testing
const SAMPLE_AUDIO_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'

// Structured dataset matching Cloudflare R2 bucket
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
    audioUrl: SAMPLE_AUDIO_URL,
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
    audioUrl: SAMPLE_AUDIO_URL,
    durationLabel: '12:30 Min.'
  },
  {
    key: 'sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/02_Abdest_ve_Edepleri.pdf',
    name: '02 - Abdest Rehberi ve İbadet Edepleri.pdf',
    folderPath: 'sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/',
    size: 1820000,
    lastModified: '2026-07-29T10:15:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/02_Abdest_ve_Edepleri.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/02_Abdest_ve_Edepleri.pdf'),
    category: 'INT - SYF - GENCLIK MFRDT',
    subCategory: 'A - NAMAZ IBADETİ VE KAZANDIRDIKLARI',
    hasPdf: true,
    hasAudio: true,
    audioUrl: SAMPLE_AUDIO_URL,
    durationLabel: '11:45 Min.'
  },
  {
    key: 'sohbets/INT - SYF - GENCLIK MFRDT/B - AHLAK VE KARAKTER/01_Genclik_ve_Guzel_Ahlak.pdf',
    name: '01 - Gençlik ve Güzel Ahlak Esasları.pdf',
    folderPath: 'sohbets/INT - SYF - GENCLIK MFRDT/B - AHLAK VE KARAKTER/',
    size: 3100000,
    lastModified: '2026-07-30T09:00:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/B - AHLAK VE KARAKTER/01_Genclik_ve_Guzel_Ahlak.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/B - AHLAK VE KARAKTER/01_Genclik_ve_Guzel_Ahlak.pdf'),
    category: 'INT - SYF - GENCLIK MFRDT',
    subCategory: 'B - AHLAK VE KARAKTER',
    hasPdf: true,
    hasAudio: true,
    audioUrl: SAMPLE_AUDIO_URL,
    durationLabel: '18:10 Min.'
  },
  {
    key: 'sohbets/INT - SYF - GENCLIK MFRDT/C - INANC ESASLARI/01_Tevhid_ve_Iman_Hakikatleri.pdf',
    name: '01 - Tevhid ve İman Hakikatleri.pdf',
    folderPath: 'sohbets/INT - SYF - GENCLIK MFRDT/C - INANC ESASLARI/',
    size: 4200000,
    lastModified: '2026-08-01T16:20:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/C - INANC ESASLARI/01_Tevhid_ve_Iman_Hakikatleri.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/INT - SYF - GENCLIK MFRDT/C - INANC ESASLARI/01_Tevhid_ve_Iman_Hakikatleri.pdf'),
    category: 'INT - SYF - GENCLIK MFRDT',
    subCategory: 'C - INANC ESASLARI',
    hasPdf: true,
    hasAudio: false
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  const search = (query.search as string || '').toLowerCase().trim()
  const pathPrefix = (query.path as string || '').trim()
  const audioOnlyFilter = query.audioOnly === 'true'

  let files: SohbetFile[] = []

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

      const command = new ListObjectsV2Command({
        Bucket: config.r2BucketName,
        Prefix: pathPrefix || 'sohbets/'
      })

      const response = await s3Client.send(command)

      if (response.Contents) {
        const pdfMap = new Map<string, any>()
        const audioMap = new Map<string, any>()

        response.Contents.forEach(item => {
          if (!item.Key) return
          const ext = item.Key.substring(item.Key.lastIndexOf('.')).toLowerCase()
          const baseKey = item.Key.substring(0, item.Key.lastIndexOf('.'))

          if (ext === '.pdf') {
            pdfMap.set(baseKey, item)
          } else if (['.mp3', '.m4a', '.wav', '.ogg'].includes(ext)) {
            audioMap.set(baseKey, item)
          }
        })

        const processedKeys = new Set<string>()

        // 1. Process all PDFs (and check for paired Audio)
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

        // 2. Process standalone Audio files (without PDF)
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
      console.warn('R2 Storage query fallback to structured dataset:', err.message)
      files = MOCK_FILES
    }
  } else {
    files = MOCK_FILES
  }

  // Filter by path
  if (pathPrefix) {
    files = files.filter(f => f.folderPath.startsWith(pathPrefix) || f.key.startsWith(pathPrefix))
  }

  // Filter by Audio Only
  if (audioOnlyFilter) {
    files = files.filter(f => f.hasAudio)
  }

  // Filter by search term
  if (search) {
    files = files.filter(f => 
      f.name.toLowerCase().includes(search) ||
      f.folderPath.toLowerCase().includes(search) ||
      f.category.toLowerCase().includes(search) ||
      f.subCategory.toLowerCase().includes(search)
    )
  }

  // Build folder hierarchy tree
  const folderTree: FolderNode[] = []
  const folderMap = new Map<string, FolderNode>()

  files.forEach(file => {
    const parts = file.folderPath.split('/').filter(Boolean)
    let currentPath = ''

    parts.forEach((part, index) => {
      const parentPath = currentPath
      currentPath = currentPath ? `${currentPath}/${part}/` : `${part}/`

      if (!folderMap.has(currentPath)) {
        const newNode: FolderNode = {
          name: part,
          fullPath: currentPath,
          children: [],
          filesCount: 0
        }
        folderMap.set(currentPath, newNode)

        if (index === 0) {
          folderTree.push(newNode)
        } else if (parentPath && folderMap.has(parentPath)) {
          folderMap.get(parentPath)!.children.push(newNode)
        }
      }
      folderMap.get(currentPath)!.filesCount++
    })
  })

  return {
    success: true,
    totalFiles: files.length,
    files,
    folderTree
  }
})
