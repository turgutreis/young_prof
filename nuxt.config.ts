import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-03',
  ssr: true,
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
      appName: 'Sohbet Archiv & PDF Bibliothek'
    }
  },
  app: {
    head: {
      title: 'Sohbet Archiv - PDF Bibliothek & Themen',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Online Plattform für Sohbet-PDFs, Unterrichtsmaterialien und Themenbibliotheken aus Cloudflare R2.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' }
      ]
    }
  }
})
