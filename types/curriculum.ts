export interface CurriculumFile {
  title: string
  href: string
  downloadUrl?: string
}

export interface CurriculumTopic {
  no: string
  title: string
  slug?: string
  files: CurriculumFile[]
}

export type CurriculumStep = 'A' | 'B' | 'C' | 'ÖZEL GÜNLER'

export interface CategoryItem {
  id: string
  no: string
  title: string
  text: string
  tone: string
  icon: string
}

export interface BookItem {
  title: string
  author: string
  cover: string
  href: string
}

export interface ActivityPlatformItem {
  name: string
  bannerImage?: string
  bannerAlt?: string
  linkHref?: string
  linkText?: string
  description?: string
}

export interface CityStop {
  name: string
  note?: string
  href?: string
  query?: string
}

export interface CityPrayerPlace {
  name: string
  href?: string
}

export interface CityGuide {
  id: string
  name: string
  country: string
  subtitle: string
  description: string
  coverImage: string
  coverAlt: string
  mapsQueryUrl: string
  placesIntro: string
  stops: CityStop[]
  food: string[]
  prayerPlaces: (CityPrayerPlace | string)[]
  institutions: string[]
}
