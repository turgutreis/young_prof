export interface AnnouncementMeeting {
  title: string
  dateRange: string
  monthYear: string
}

export interface AnnouncementData {
  eyebrow: string
  title: string
  description: string
  meetings: AnnouncementMeeting[]
  buttonText: string
  buttonHref: string
}

export const initialAnnouncement: AnnouncementData = {
  eyebrow: 'Son duyuru',
  title: 'Yeni dönem buluşması',
  description: 'Yeni dönem planını birlikte şekillendirmek için fikirlerinle aramıza katıl.',
  meetings: [
    {
      title: '1. Buluşma',
      dateRange: '16–18',
      monthYear: 'EKİM 2026'
    },
    {
      title: '2. Buluşma',
      dateRange: '30 EKİM – 1 KASIM',
      monthYear: '2026'
    }
  ],
  buttonText: 'Bilgi al ↗',
  buttonHref: 'mailto:info@young-professionals.eu'
}
