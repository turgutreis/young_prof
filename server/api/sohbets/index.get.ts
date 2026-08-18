import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export interface SohbetFile {
  key: string
  name: string
  folderPath: string
  size: number
  lastModified: string
  downloadUrl: string
  previewUrl?: string
  fileType: 'pdf' | 'audio' | 'image' | 'doc' | 'other'
  hasAudio: boolean
  hasPdf: boolean
  audioUrl?: string
  audioKey?: string
  durationLabel?: string
}

export interface FolderNode {
  name: string
  fullPath: string
  filesCount: number
}

function getFileType(fileName: string): 'pdf' | 'audio' | 'image' | 'doc' | 'other' {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return 'pdf'
  if (['mp3', 'm4a', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio'
  if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) return 'image'
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'].includes(ext)) return 'doc'
  return 'other'
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  const search = (query.search as string || '').toLowerCase().trim()
  let currentPath = (query.path as string || '').trim().normalize('NFC')
  const audioOnlyFilter = query.audioOnly === 'true'

  if (currentPath && !currentPath.endsWith('/')) {
    currentPath += '/'
  }

  let allObjects: any[] = []
  let isLiveR2Data = false

  // 1. DYNAMICALLY FETCH ALL OBJECTS FROM CLOUDFLARE R2 BUCKET
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

      let isTruncated = true
      let continuationToken: string | undefined = undefined

      while (isTruncated) {
        const command: ListObjectsV2Command = new ListObjectsV2Command({
          Bucket: config.r2BucketName,
          ContinuationToken: continuationToken
        })

        const response = await s3Client.send(command)
        if (response.Contents) {
          allObjects.push(...response.Contents)
        }

        isTruncated = !!response.IsTruncated
        continuationToken = response.NextContinuationToken
      }

      isLiveR2Data = true
    } catch (err: any) {
      console.error('Error fetching live Cloudflare R2 bucket objects:', err.message)
    }
  }

  // 2. PARSE REAL FILES & FOLDERS DYNAMICALLY
  const allParsedFiles: SohbetFile[] = []
  const subFolderMap = new Map<string, { name: string, fullPath: string, filesCount: number }>()

  // Filter out folder-marker keys ending with "/" and 0 size
  const validObjects = allObjects.filter(item => item.Key && !item.Key.endsWith('/'))

  for (const item of validObjects) {
    const rawKey: string = item.Key.normalize('NFC')
    const lastSlashIndex = rawKey.lastIndexOf('/')
    const fileName = lastSlashIndex >= 0 ? rawKey.substring(lastSlashIndex + 1) : rawKey
    const folderPath = lastSlashIndex >= 0 ? rawKey.substring(0, lastSlashIndex + 1) : ''
    const fileType = getFileType(fileName)

    const isAudio = fileType === 'audio'
    const isPdf = fileType === 'pdf'

    const streamUrl = `/api/sohbets/stream?key=${encodeURIComponent(rawKey)}`
    const downloadUrl = `/api/sohbets/stream?download=true&key=${encodeURIComponent(rawKey)}`

    allParsedFiles.push({
      key: rawKey,
      name: fileName,
      folderPath,
      size: item.Size || 0,
      lastModified: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString(),
      downloadUrl,
      previewUrl: (isPdf || fileType === 'image') ? streamUrl : undefined,
      fileType,
      hasAudio: isAudio,
      hasPdf: isPdf,
      audioUrl: isAudio ? streamUrl : undefined,
      audioKey: isAudio ? rawKey : undefined,
      durationLabel: isAudio ? 'Audio' : undefined
    })
  }

  // Determine current directory files & subfolders
  let directFiles: SohbetFile[] = []

  if (search) {
    // If searching, search all files across entire bucket
    directFiles = allParsedFiles.filter(f => 
      f.name.toLowerCase().includes(search) ||
      f.folderPath.toLowerCase().includes(search)
    )
  } else {
    // 1. Find direct files at the current folder level
    directFiles = allParsedFiles.filter(f => f.folderPath === currentPath)

    // 2. Find direct subfolders at the current folder level
    for (const f of allParsedFiles) {
      if (f.folderPath.startsWith(currentPath) && f.folderPath !== currentPath) {
        const remaining = f.folderPath.substring(currentPath.length)
        const nextSegment = remaining.split('/')[0]
        if (nextSegment) {
          const subFullPath = `${currentPath}${nextSegment}/`
          if (!subFolderMap.has(subFullPath)) {
            subFolderMap.set(subFullPath, {
              name: nextSegment,
              fullPath: subFullPath,
              filesCount: 0
            })
          }
          subFolderMap.get(subFullPath)!.filesCount++
        }
      }
    }
  }

  // Filter Audio Only if active
  if (audioOnlyFilter) {
    directFiles = directFiles.filter(f => f.hasAudio)
  }

  const subFolders = Array.from(subFolderMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'))

  return {
    success: true,
    isLiveR2Data,
    currentPath,
    totalFiles: directFiles.length,
    files: directFiles,
    subFolders
  }
})
