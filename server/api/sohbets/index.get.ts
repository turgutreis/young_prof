import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export interface SohbetFile {
  key: string
  name: string
  folderPath: string
  size: number
  lastModified: string
  downloadUrl: string
  previewUrl: string
  category: string
  subCategory: string
  hasAudio: boolean
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

// Sample audio URLs for testing in development
const SAMPLE_AUDIO_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'

// Structured dataset matching Cloudflare R2 bucket with PDF and Audio support
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
    hasAudio: true,
    audioUrl: SAMPLE_AUDIO_URL,
    durationLabel: '14:20 Min.'
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
    hasAudio: false
  },
  {
    key: 'sohbets/TEMEL_SOHBETLER/01_Kurani_Kerim_Okuma_ve_Anlama.pdf',
    name: '01 - Kur\'an-ı Kerim Okuma ve Anlama Metodu.pdf',
    folderPath: 'sohbets/TEMEL_SOHBETLER/',
    size: 1950000,
    lastModified: '2026-08-02T11:45:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/TEMEL_SOHBETLER/01_Kurani_Kerim_Okuma_ve_Anlama.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/TEMEL_SOHBETLER/01_Kurani_Kerim_Okuma_ve_Anlama.pdf'),
    category: 'TEMEL_SOHBETLER',
    subCategory: 'Genel',
    hasAudio: true,
    audioUrl: SAMPLE_AUDIO_URL,
    durationLabel: '22:05 Min.'
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
        const audioMap = new Map<string, string>()

        // Find all audio keys first (.mp3, .m4a, .wav)
        response.Contents.forEach(item => {
          if (item.Key && (item.Key.endsWith('.mp3') || item.Key.endsWith('.m4a') || item.Key.endsWith('.wav'))) {
            const baseName = item.Key.substring(0, item.Key.lastIndexOf('.'))
            audioMap.set(baseName, item.Key)
          }
        })

        files = response.Contents
          .filter(item => item.Key && item.Key.endsWith('.pdf'))
          .map(item => {
            const key = item.Key!
            const parts = key.split('/')
            const fileName = parts[parts.length - 1]
            const folderPath = key.substring(0, key.lastIndexOf('/') + 1)
            
            const category = parts.length > 2 ? parts[1] : 'Genel'
            const subCategory = parts.length > 3 ? parts[2] : 'Genel'

            const baseName = key.substring(0, key.lastIndexOf('.'))
            const matchingAudioKey = audioMap.get(baseName)

            const hasAudio = !!matchingAudioKey
            const audioUrl = matchingAudioKey ? `/api/sohbets/stream?key=${encodeURIComponent(matchingAudioKey)}` : undefined

            return {
              key,
              name: fileName,
              folderPath,
              size: item.Size || 0,
              lastModified: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString(),
              downloadUrl: `/api/sohbets/stream?download=true&key=${encodeURIComponent(key)}`,
              previewUrl: `/api/sohbets/stream?key=${encodeURIComponent(key)}`,
              category,
              subCategory,
              hasAudio,
              audioUrl,
              audioKey: matchingAudioKey,
              durationLabel: hasAudio ? 'Audio Paket' : undefined
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
