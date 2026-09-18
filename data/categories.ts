import type { CategoryItem } from '~/types'

/**
 * The 5 core interactive categories of Young Professionals EU
 */
export const categories: CategoryItem[] = [
  {
    id: 'curriculum',
    no: '01',
    title: 'Müfredat',
    text: 'Adım adım gelişim programları ve dönem planları',
    tone: 'curriculumBlue',
    icon: '✦'
  },
  {
    id: 'books',
    no: '02',
    title: 'Kütüphane',
    text: 'Kitap tavsiyeleri, seçilmiş okumalar ve özetler',
    tone: 'lime',
    icon: '⌁'
  },
  {
    id: 'activities',
    no: '03',
    title: 'Aktiviteler / Ünite Çalışmaları',
    text: 'Grup çalışmaları, atölyeler ve uygulanabilir etkinlikler',
    tone: 'violet',
    icon: '◎'
  },
  {
    id: 'routes',
    no: '04',
    title: 'Gezi Güzergâhları',
    text: 'Kültür, tarih ve doğayı keşfetmek için hazır rotalar',
    tone: 'routesGreen',
    icon: '↗'
  },
  {
    id: 'news',
    no: '05',
    title: 'Duyurular',
    text: 'Yeni programlar, buluşmalar ve önemli tarihler',
    tone: 'yellow',
    icon: '!'
  }
]
