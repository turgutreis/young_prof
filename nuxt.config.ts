import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-03',
  ssr: true,
  experimental: {
    appManifest: false
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/css/main.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    r2AccountId: process.env.R2_ACCOUNT_ID || '',
    r2Endpoint: process.env.R2_ENDPOINT || '',
    r2BucketName: process.env.R2_BUCKET_NAME || 'sohbet-files',
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    r2PublicUrl: process.env.R2_PUBLIC_URL || '',
    public: {
      appName: 'Young Professionals EU'
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'tr'
      },
      title: 'Young Professionals EU · Gençlik Bilgi ve Tecrübe Paylaşım Platformu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Gençlik Bilgi ve Tecrübe Paylaşım Platformu' },
        // Open Graph / WhatsApp / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Young Professionals EU' },
        { property: 'og:title', content: 'Young Professionals EU' },
        { property: 'og:description', content: 'Gençlik Bilgi ve Tecrübe Paylaşım Platformu' },
        { property: 'og:url', content: 'https://young-professionals.eu' },
        { property: 'og:image', content: 'https://young-professionals.eu/og.png' },
        { property: 'og:image:secure_url', content: 'https://young-professionals.eu/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Young Professionals EU - Gençlik Bilgi ve Tecrübe Paylaşım Platformu' },
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Young Professionals EU' },
        { name: 'twitter:description', content: 'Gençlik Bilgi ve Tecrübe Paylaşım Platformu' },
        { name: 'twitter:image', content: 'https://young-professionals.eu/og.png' },
        { name: 'theme-color', content: '#080808' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://young-professionals.eu' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' }
      ]
    }
  }
})
