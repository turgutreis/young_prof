import type { BookItem } from '~/types'
import { getR2Url } from '~/utils/r2'

/**
 * 2026–2027 Reading Plan Books with Cloudflare R2 covers
 */
export const readingPlanBooks: BookItem[] = [
  {
    title: 'Kur’an’ın Sihirli Ufku: Fatiha ve Bakara Suresi (1–39)',
    author: 'M. Fethullah Gülen',
    cover: getR2Url('books/2026-27/fatiha-bakara.png'),
    href: 'https://kitapdunyasi.eu/products/kuranin-sihirli-ufku-fatiha-ve-bakara-suresi-1-39'
  },
  {
    title: 'Adanmış Bir Gönül İnsanı: Hacı Ata',
    author: 'Muhittin Küçük',
    cover: getR2Url('books/2026-27/haci-ata.png'),
    href: 'https://kitapdunyasi.eu/products/adanmis-bir-gonul-i̇nsani-haci-ata'
  },
  {
    title: 'Das Hauptgebet – Mein Augenlicht',
    author: 'Şerif Özcan',
    cover: getR2Url('books/2026-27/das-hauptgebet.png'),
    href: 'https://kitapdunyasi.eu/collections/yeni-cikanlar/products/das-hauptgebet-mein-augenlicht'
  },
  {
    title: 'Gençlik Rehberi Üzerine',
    author: 'Bediüzzaman Said Nursî · Açıklamalar: Abdullah Aymaz',
    cover: getR2Url('books/2026-27/genclik-rehberi.png'),
    href: 'https://kitapdunyasi.eu/products/genclik-rehberi-uzerine-sureyya?_pos=2&_sid=c1694656b&_ss=r'
  },
  {
    title: 'İnsan Neyle Yaşar?',
    author: 'L. N. Tolstoy',
    cover: getR2Url('books/2026-27/insan-neyle-yasar.png'),
    href: 'https://kitapdunyasi.eu/products/i̇nsan-neyle-yasar-karton-kapak?_pos=2&_sid=18edda30d&_ss=r'
  },
  {
    title: 'Yayınlanmayan Lâhika Mektuplarından Seçmeler',
    author: 'Bediüzzaman Said Nursî',
    cover: getR2Url('books/2026-27/yayinlanmayan-lahika-mektuplari.png'),
    href: 'https://kitapdunyasi.eu/products/yayinlanmayan-lahika-mektuplari?_pos=1&_sid=c97367bb2&_ss=r'
  },
  {
    title: '40 Hadithe – Essenzielle Lehren des Propheten Muhammed',
    author: 'Mit Kommentar von Esat Mavinehir',
    cover: getR2Url('books/2026-27/40-hadithe.png'),
    href: 'https://kitapdunyasi.eu/products/40-hadithe-essenzielle-lehren-des-propheten-muhammed?_pos=1&_sid=2c744cd93&_ss=r'
  }
]
