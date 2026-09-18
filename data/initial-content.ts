import type { SiteContent } from '~/types'
import { categories } from './categories'
import { curriculumTopics } from './curriculum'
import { readingPlanBooks } from './library'
import { activityPlatforms, activityPlatformDetails } from './activities'
import {
  hamburgFood,
  hamburgStops,
  hamburgMosques,
  hamburgInstitutions,
  frankfurtFood,
  frankfurtStops,
  frankfurtInstitutions,
  frankfurtPrayer
} from './cityGuides'
import { initialAnnouncement } from './announcements'

export function getInitialSiteContent(): SiteContent {
  return {
    categories,
    curriculumTopics,
    readingPlanBooks,
    activityPlatforms,
    activityPlatformDetails,
    cityGuides: {
      hamburgFood,
      hamburgStops,
      hamburgMosques,
      hamburgInstitutions,
      frankfurtFood,
      frankfurtStops,
      frankfurtInstitutions,
      frankfurtPrayer
    },
    announcement: initialAnnouncement,
    lastUpdated: new Date().toISOString()
  }
}
