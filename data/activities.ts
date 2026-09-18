import type { ActivityPlatformItem } from '~/types'

/**
 * 5 Sub-platforms for youth growth and sharing
 */
export const activityPlatforms: string[] = [
  'Gençlik Açılım ve Diyalog Platformu',
  'Gençlik Okuma Kulübü',
  'Genç İş İnsanları Platformu',
  'Genç Aile',
  'Genç Spor-Aktivite Platformu'
]

/**
 * Structured details for platforms with active events / seminars
 */
export const activityPlatformDetails: Record<string, ActivityPlatformItem> = {
  'Genç Aile': {
    name: 'Genç Aile',
    bannerImage: '/genc-aile-evlilige-hazirlik-egitimi.png',
    bannerAlt: 'Erdemliler Yolu Akademisi Evliliğe Hazırlık Eğitimi afişi',
    linkHref: 'https://erdemlileryolu.de/kurslar/huzurlu-bir-yuva-icin-aile-seminerleri-online/',
    linkText: 'Seminer bilgileri ve kayıt ↗'
  },
  'Genç İş İnsanları Platformu': {
    name: 'Genç İş İnsanları Platformu',
    bannerImage: '/genc-is-insanlari-jung-selbststandig.png',
    bannerAlt: 'Jung und Selbstständig etkinlik afişi',
    linkHref: 'https://www.buv-ev.de/jung-selbststandig-2/',
    linkText: 'Etkinlik bilgilerini görüntüle ↗'
  }
}
