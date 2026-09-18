import { uploadFileToR2 } from '~/server/utils/r2'

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

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yüklenecek dosya bulunamadı.'
    })
  }

  let folder = 'files/uploads'
  let customFilename = ''
  let fileItem: any = null

  for (const item of formData) {
    if (item.name === 'folder' && item.data) {
      folder = item.data.toString('utf-8').trim()
    } else if (item.name === 'customFilename' && item.data) {
      customFilename = item.data.toString('utf-8').trim()
    } else if (item.filename && item.data) {
      fileItem = item
    }
  }

  if (!fileItem) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dosya verisi eksik.'
    })
  }

  // Clean folder path
  folder = folder.replace(/^\/|\/$/g, '')

  // Determine file name
  let targetName = customFilename || fileItem.filename
  targetName = targetName.toLowerCase().replace(/[^a-z0-9.-]/g, '-').replace(/-+/g, '-')

  const key = `${folder}/${targetName}`
  const contentType = fileItem.type || 'application/octet-stream'

  try {
    const uploadedKey = await uploadFileToR2(config, key, fileItem.data, contentType)
    const streamUrl = `/api/sohbets/stream?key=${encodeURIComponent(uploadedKey)}`

    return {
      success: true,
      key: uploadedKey,
      href: streamUrl,
      fileName: targetName,
      size: fileItem.data.length
    }
  } catch (err: any) {
    console.error('Failed to upload file to R2:', err)
    throw createError({
      statusCode: 500,
      statusMessage: `Yükleme hatası: ${err.message || 'Bilinmeyen hata'}`
    })
  }
})
