import type { CityPrayerPlace, CityStop } from '~/types'

// Hamburg City Guide Data
export const hamburgFood: string[] = [
  'Merdane (Helal)',
  'Grand Café Back-Lava (Helal)',
  'Tibarg Kebap Haus (Helal)',
  'Anime Burger (Helal)',
  'Leontes Eis und Kaffee (Dondurma, pizza, helal)'
]

export const hamburgStops: CityStop[] = [
  { name: 'Alster · Jungfernstieg · Binnenalster', note: 'Tretboot turu', href: 'https://maps.app.goo.gl/5yV8wPWgrSEcvUt37' },
  { name: 'Hamburg Rathaus', href: 'https://maps.app.goo.gl/JQYG7cmCkuB2oiadA' },
  { name: 'Landungsbrücken', note: 'Feribot ve liman manzarası', href: 'https://maps.app.goo.gl/5z7sZLsDF55iK7fd9' },
  { name: 'Alter Elbtunnel', href: 'https://maps.app.goo.gl/NTyj7GpBKN156fbH8' },
  { name: 'Speicherstadt', href: 'https://maps.app.goo.gl/AYZsUQ9ytF3Se5Xe8' },
  { name: 'Elbphilharmonie Plaza', note: 'Ücretsiz seyir platformu', href: 'https://maps.app.goo.gl/rLiGvM6vGLiRSJw69' },
  { name: 'Miniatur Wunderland', note: 'Müze', href: 'https://maps.app.goo.gl/zhbcUB2BWNKcZbBQ8' },
  { name: 'St. Michaelis – Der Michel', note: 'Seyir platformu', href: 'https://maps.app.goo.gl/koAttSPsF3Sgpy6b7' },
  { name: 'Planten un Blomen', note: 'Mayıs–Eylül, saat 21.00’den sonra su ve ışık konseri', href: 'https://maps.app.goo.gl/tYvzXu6oreWVsSYQ9' },
  { name: 'Fischmarkt', note: 'Pazar günleri saat 05.00’ten itibaren', href: 'https://maps.app.goo.gl/DA4qstSF5eUHav6G9' },
  { name: 'Mahnmal St. Nikolai', note: 'Seyir platformu', href: 'https://maps.app.goo.gl/uSgE1CykajzaqeUB9' },
  { name: 'Hamburger Kunsthalle', href: 'https://maps.app.goo.gl/H1X1YdWRYX6a89YTA' },
  { name: 'Westfield Hamburg-Überseequartier', note: 'Alışveriş', href: 'https://maps.app.goo.gl/hiphb8Pm85H4Eow4A' }
]

export const hamburgMosques: CityPrayerPlace[] = [
  { name: 'Islamische Gemeinde Hamburg – Centrum Moschee', href: 'https://maps.app.goo.gl/GvsUiZLmGjGctb6y6' },
  { name: 'Moscheegemeinde Altona Ulu Cami', href: 'https://maps.app.goo.gl/TKn8i29GXfzcRdkK7' },
  { name: 'DİTİB Türkisch Islamische Gemeinde', href: 'https://maps.app.goo.gl/5EhTy6AXQKRLLEbu7' }
]

export const hamburgInstitutions: string[] = [
  'Forum Dialog',
  'Akademikerbund',
  'Die Kraft der Toleranz',
  'Ehil e.V.',
  'Alsterring Gymnasium'
]

// Frankfurt City Guide Data
export const frankfurtFood: string[] = [
  'Emir ET Restaurant',
  'Anne Cafe & Restaurant & Catering',
  'BigChefs Frankfurt',
  "Josef's Biofleisch",
  'Nirwana Grill',
  'Restaurant Thai Fun Halal',
  'Sos Döner Frankfurt',
  'Anteplioğlu Frankfurt'
]

export const frankfurtStops: CityStop[] = [
  { name: 'Main Nehri gezisi', note: 'Nehir kıyısı ve tekne gezisi', query: 'Main river cruise Frankfurt' },
  { name: 'Müzeler Gecesi', note: 'Cumartesi, 25 Nisan 2026', query: 'Nacht der Museen Frankfurt' },
  { name: 'Dippemess', note: '27 Mart–19 Nisan ve 11–27 Eylül 2026', query: 'Dippemess Frankfurt' },
  { name: 'Mehmet Ali Şengül Kabri', note: 'Hanau', query: 'Mehmet Ali Şengül Grab Hanau' }
]

export const frankfurtInstitutions: string[] = [
  'Avicenna Institut e.V.',
  'RUMI Kulturzentrum Frankfurt e.V.',
  'Forum für Interkulturellen Dialog e.V. (FID e.V.)',
  'Avicenna Institut e.V. (Höchst)'
]

export const frankfurtPrayer: string[] = [
  'DİTİB Merkez Camii Frankfurt',
  'Bahnhofsmission, Caritasverband Frankfurt e.V.'
]
