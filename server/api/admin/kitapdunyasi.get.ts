import { verifyAdminSession } from '~/server/utils/auth'

export interface KitapDunyasiBook {
  id: number | string
  title: string
  author: string
  cover: string
  href: string
  vendor?: string
}

const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes
const pageCache = new Map<number, { products: KitapDunyasiBook[]; cachedAt: number }>()
const productCache = new Map<string, { book: KitapDunyasiBook; cachedAt: number }>()

function extractAuthorFromHtml(html: string | null | undefined, fallbackVendor = ''): string {
  if (html) {
    const cleanText = html
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')

    const match = cleanText.match(/(?:Yazar|Autor|Author)\s*:\s*([^\n\r]+)/i)
    if (match && match[1]) {
      const extracted = match[1].trim()
      if (extracted && extracted.length < 120) {
        return extracted
      }
    }
  }
  return fallbackVendor || ''
}

function normalizeShopifyProduct(p: any): KitapDunyasiBook {
  const handle = p.handle || ''
  return {
    id: p.id || handle,
    title: (p.title || '').trim(),
    author: extractAuthorFromHtml(p.body_html, p.vendor || ''),
    cover: p.images?.[0]?.src || p.image?.src || '/og.png',
    href: handle ? `https://kitapdunyasi.eu/products/${handle}` : 'https://kitapdunyasi.eu',
    vendor: p.vendor || ''
  }
}

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  let lastRes: Response | null = null
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YoungProfessionalsEU/1.0)',
        Accept: 'application/json'
      }
    })
    if (res.ok) return res
    lastRes = res
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 800 * (i + 1)))
      continue
    }
    return res
  }
  return lastRes!
}

export default defineEventHandler(async (event) => {
  verifyAdminSession(event)

  const query = getQuery(event)
  const rawUrl = typeof query.url === 'string' ? query.url.trim() : ''

  // Mode A: Fetch a single product by URL
  if (rawUrl) {
    let parsed: URL
    try {
      parsed = new URL(rawUrl)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçersiz URL formatı.'
      })
    }

    if (parsed.hostname !== 'kitapdunyasi.eu' && parsed.hostname !== 'www.kitapdunyasi.eu') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Sadece kitapdunyasi.eu linkleri desteklenmektedir.'
      })
    }

    const match = parsed.pathname.match(/\/products\/([^/?#]+)/i)
    if (!match || !match[1]) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Geçerli bir kitapdunyasi.eu ürün linki girin (/products/...).'
      })
    }

    const handle = decodeURIComponent(match[1]).replace(/\.json$/i, '')
    const cached = productCache.get(handle)
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return { book: cached.book }
    }

    const res = await fetchWithRetry(`https://kitapdunyasi.eu/products/${encodeURIComponent(handle)}.json`)
    if (!res.ok) {
      throw createError({
        statusCode: res.status === 404 ? 404 : 502,
        statusMessage:
          res.status === 404
            ? 'Bu ürün kitapdunyasi.eu üzerinde bulunamadı.'
            : `kitapdunyasi.eu geçici olarak yanıt vermedi (HTTP ${res.status}). Lütfen tekrar deneyin.`
      })
    }

    const data: any = await res.json()
    if (!data?.product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ürün verisi okunamadı.'
      })
    }

    const book = normalizeShopifyProduct(data.product)
    productCache.set(handle, { book, cachedAt: Date.now() })
    return { book }
  }

  // Mode B: Browse catalog page
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1)
  const limit = 12

  const cachedPage = pageCache.get(page)
  if (cachedPage && Date.now() - cachedPage.cachedAt < CACHE_TTL_MS) {
    return {
      products: cachedPage.products,
      page,
      hasMore: cachedPage.products.length === limit
    }
  }

  const res = await fetchWithRetry(
    `https://kitapdunyasi.eu/collections/all/products.json?limit=${limit}&page=${page}`
  )

  if (!res.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `kitapdunyasi.eu kataloğu şu an yüklenemedi (HTTP ${res.status}). Link yapıştırarak veya manuel ekleyebilirsiniz.`
    })
  }

  const data: any = await res.json()
  const products: KitapDunyasiBook[] = Array.isArray(data?.products)
    ? data.products.map(normalizeShopifyProduct)
    : []

  pageCache.set(page, { products, cachedAt: Date.now() })

  return {
    products,
    page,
    hasMore: products.length === limit
  }
})
