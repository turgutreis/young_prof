import type {
  CategoryItem,
  CurriculumStep,
  CurriculumTopic,
  BookItem,
  ActivityPlatformItem,
  CityStop,
  CityPrayerPlace
} from './curriculum'
import type { AnnouncementData } from '~/data/announcements'

export interface CityGuidesData {
  hamburgFood: string[]
  hamburgStops: CityStop[]
  hamburgMosques: CityPrayerPlace[]
  hamburgInstitutions: string[]
  frankfurtFood: string[]
  frankfurtStops: CityStop[]
  frankfurtInstitutions: string[]
  frankfurtPrayer: string[]
}

export interface SiteContent {
  categories: CategoryItem[]
  curriculumTopics: Record<CurriculumStep, CurriculumTopic[]>
  readingPlanBooks: BookItem[]
  activityPlatforms: string[]
  activityPlatformDetails: Record<string, ActivityPlatformItem>
  cityGuides: CityGuidesData
  announcement: AnnouncementData
  lastUpdated?: string
}
