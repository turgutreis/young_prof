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
  icon?: string
}

// Fallback dataset matching the exact 4 Meta Categories
const MOCK_FILES: SohbetFile[] = [
  {
    key: 'sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/01_Namazin_Onemi_ve_Ibadet.pdf',
    name: '01 - Namazın Önemi ve İbadetin Kazandırdıkları.pdf',
    folderPath: 'sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/',
    size: 2450000,
    lastModified: '2026-07-28T14:30:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/01_Namazin_Onemi_ve_Ibadet.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/01_Namazin_Onemi_ve_Ibadet.pdf'),
    category: 'MÜFREDAT',
    subCategory: 'A - NAMAZ IBADETİ VE KAZANDIRDIKLARI',
    hasPdf: true,
    hasAudio: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    durationLabel: '14:20 Min.'
  },
  {
    key: 'sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/02_Abdest_ve_Edepleri.pdf',
    name: '02 - Abdest Rehberi ve İbadet Edepleri.pdf',
    folderPath: 'sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/',
    size: 1820000,
    lastModified: '2026-07-29T10:15:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/02_Abdest_ve_Edepleri.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/MÜFREDAT/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/02_Abdest_ve_Edepleri.pdf'),
    category: 'MÜFREDAT',
    subCategory: 'A - NAMAZ IBADETİ VE KAZANDIRDIKLARI',
    hasPdf: true,
    hasAudio: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    durationLabel: '11:45 Min.'
  },
  {
    key: 'sohbets/KİTAP TAVSİYELERİ/01_Tavsiye_Edilen_Eserler.pdf',
    name: '01 - Gençlik İçin Tavsiye Edilen Temel Eserler Listesi.pdf',
    folderPath: 'sohbets/KİTAP TAVSİYELERİ/',
    size: 1950000,
    lastModified: '2026-08-02T11:45:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/KİTAP TAVSİYELERİ/01_Tavsiye_Edilen_Eserler.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/KİTAP TAVSİYELERİ/01_Tavsiye_Edilen_Eserler.pdf'),
    category: 'KİTAP TAVSİYELERİ',
    subCategory: 'Genel',
    hasPdf: true,
    hasAudio: false
  },
  {
    key: 'sohbets/GEZİ GÜZERGAHLARI/01_Tarihi_ve_Kültürel_Gezi_Rehberi.pdf',
    name: '01 - Tarihi ve Kültürel Gezi Rehberi & Güzergahlar.pdf',
    folderPath: 'sohbets/GEZİ GÜZERGAHLARI/',
    size: 3400000,
    lastModified: '2026-08-03T15:00:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/GEZİ GÜZERGAHLARI/01_Tarihi_ve_Kültürel_Gezi_Rehberi.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/GEZİ GÜZERGAHLARI/01_Tarihi_ve_Kültürel_Gezi_Rehberi.pdf'),
    category: 'GEZİ GÜZERGAHLARI',
    subCategory: 'Gezi Rehberi',
    hasPdf: true,
    hasAudio: false
  },
  {
    key: 'sohbets/AKTİVİTELER / ÜNİTE ÇALIŞMALARI/01_Aktivite_ve_Unite_Calisma_Rehberi.pdf',
    name: '01 - İnteraktif Aktivite ve Ünite Çalışma Rehberi.pdf',
    folderPath: 'sohbets/AKTİVİTELER / ÜNİTE ÇALIŞMALARI/',
    size: 2800000,
    lastModified: '2026-08-04T12:00:00Z',
    downloadUrl: '/api/sohbets/stream?download=true&key=' + encodeURIComponent('sohbets/AKTİVİTELER / ÜNİTE ÇALIŞMALARI/01_Aktivite_ve_Unite_Calisma_Rehberi.pdf'),
    previewUrl: '/api/sohbets/stream?key=' + encodeURIComponent('sohbets/AKTİVİTELER / ÜNİTE ÇALIŞMALARI/01_Aktivite_ve_Unite_Calisma_Rehberi.pdf'),
    category: 'AKTİVİTELER / ÜNİTE ÇALIŞMALARI',
    subCategory: 'Ünite Çalışmaları',
    hasPdf: true,
    hasAudio: true,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    durationLabel: '15:00 Min.'
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  const search = (query.search as string || '').toLowerCase().trim()
  let pathPrefix = (query.path as string || '').trim()
  const audioOnlyFilter = query.audioOnly === 'true'

  if (pathPrefix && !pathPrefix.endsWith('/')) {
    pathPrefix += '/'
  }

  let files: SohbetFile[] = []
  let subFolders: FolderNode[] = []
  let isLiveR2Data = false

  // 1. LIVE CLOUDFLARE R2 S3 API QUERY
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

      let effectivePrefix = pathPrefix

      // First query
      let command = new ListObjectsV2Command({
        Bucket: config.r2BucketName,
        Prefix: effectivePrefix,
        Delimiter: '/'
      })

      let response = await s3Client.send(command)
      isLiveR2Data = true

      // If at root level and the only subfolder is "sohbets/", auto-step into "sohbets/"
      if (!pathPrefix && response.CommonPrefixes && response.CommonPrefixes.length === 1) {
        const singlePrefix = response.CommonPrefixes[0].Prefix
        if (singlePrefix && singlePrefix.toLowerCase() === 'sohbets/') {
          effectivePrefix = 'sohbets/'
          command = new ListObjectsV2Command({
            Bucket: config.r2BucketName,
            Prefix: effectivePrefix,
            Delimiter: '/'
          })
          response = await s3Client.send(command)
        }
      }

      // Parse Subfolders (CommonPrefixes)
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

      // Parse Files (Contents)
      if (response.Contents) {
        const pdfMap = new Map<string, any>()
        const audioMap = new Map<string, any>()

        response.Contents.forEach(item => {
          if (!item.Key || item.Key === effectivePrefix) return
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
          
          const category = parts.length > 1 ? parts[0] : 'Genel'
          const subCategory = parts.length > 2 ? parts[1] : 'Genel'

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
            
            const category = parts.length > 1 ? parts[0] : 'Genel'
            const subCategory = parts.length > 2 ? parts[1] : 'Genel'

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

  // 2. FALLBACK MODE IF NO R2 KEYS IN .ENV
  if (!isLiveR2Data) {
    let sourceFiles = MOCK_FILES
    const activePrefix = pathPrefix || 'sohbets/'

    sourceFiles = sourceFiles.filter(f => f.folderPath.startsWith(activePrefix))

    // Direct files in activePrefix
    files = sourceFiles.filter(f => f.folderPath === activePrefix)

    // Subfolders under activePrefix
    const folderMap = new Map<string, FolderNode>()
    sourceFiles.forEach(f => {
      if (f.folderPath.startsWith(activePrefix) && f.folderPath !== activePrefix) {
        const relativePath = f.folderPath.substring(activePrefix.length)
        const firstSegment = relativePath.split('/')[0]
        if (firstSegment) {
          const fullPath = `${activePrefix}${firstSegment}/`
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
