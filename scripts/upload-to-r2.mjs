import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Simple .env parser to avoid extra dependency
function loadEnv() {
  const envPath = path.join(rootDir, '.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim()
        const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}

loadEnv()

const accountId = process.env.R2_ACCOUNT_ID || '18ddf24bfbdb3e1d54dd2a7fea311be6'
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const bucketName = process.env.R2_BUCKET_NAME || 'sohbet-files'
const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`

if (!accessKeyId || !secretAccessKey) {
  console.error('\n❌ FEHLER: R2_ACCESS_KEY_ID oder R2_SECRET_ACCESS_KEY fehlen in deiner .env-Datei!')
  console.error('Bitte trage deine Cloudflare R2 API Tokens in die Datei .env ein.\n')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.pdf': return 'application/pdf'
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    case '.svg': return 'image/svg+xml'
    case '.mp3': return 'audio/mpeg'
    case '.m4a': return 'audio/mp4'
    case '.wav': return 'audio/wav'
    case '.json': return 'application/json'
    default: return 'application/octet-stream'
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    if (file === '.DS_Store' || file.startsWith('._')) continue
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles)
    } else {
      arrayOfFiles.push(fullPath)
    }
  }
  return arrayOfFiles
}

async function uploadFile(fullPath, s3Key) {
  const fileBuffer = fs.readFileSync(fullPath)
  const mimeType = getMimeType(fullPath)
  const fileSizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(2)

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
  })

  await s3.send(command)
  console.log(`✅ Hochgeladen: ${s3Key} (${fileSizeMb} MB, ${mimeType})`)
}

async function main() {
  console.log(`\n🚀 Starte Upload in Cloudflare R2 Bucket: "${bucketName}"...`)
  console.log(`📡 Endpoint: ${endpoint}\n`)

  const directoriesToUpload = [
    { localDir: path.join(rootDir, 'public', 'files'), prefix: 'files/' },
    { localDir: path.join(rootDir, 'public', 'books'), prefix: 'books/' },
  ]

  let totalFiles = 0
  let successCount = 0
  let errorCount = 0

  for (const { localDir, prefix } of directoriesToUpload) {
    if (!fs.existsSync(localDir)) continue
    const files = getAllFiles(localDir)

    for (const file of files) {
      totalFiles++
      const relativePath = path.relative(localDir, file).replace(/\\/g, '/')
      const s3Key = `${prefix}${relativePath}`

      try {
        await uploadFile(file, s3Key)
        successCount++
      } catch (err) {
        console.error(`❌ Fehler beim Upload von ${s3Key}:`, err.message)
        errorCount++
      }
    }
  }

  console.log('\n========================================')
  console.log(`🎉 Upload abgeschlossen!`)
  console.log(`📊 Gesamt: ${totalFiles} Dateien`)
  console.log(`✅ Erfolgreich: ${successCount}`)
  if (errorCount > 0) {
    console.log(`❌ Fehlgeschlagen: ${errorCount}`)
  }
  console.log('========================================\n')
}

main()
