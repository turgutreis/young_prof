import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const darkWarmTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0D0F18',
    surface: '#161928',
    'surface-variant': '#202438',
    primary: '#F59E0B', // Warm Amber Gold
    'primary-darken-1': '#D97706',
    secondary: '#10B981', // Emerald Teal
    accent: '#EC4899', // Warm Rose
    error: '#F43F5E',
    info: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B'
  }
}

const lightWarmTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FAF8F5', // Soft Warm Cream
    surface: '#FFFFFF',
    'surface-variant': '#F3EFEA',
    primary: '#D97706', // Rich Gold Amber
    'primary-darken-1': '#B45309',
    secondary: '#059669', // Emerald
    accent: '#E11D48',
    error: '#E11D48',
    info: '#2563EB',
    success: '#059669',
    warning: '#D97706'
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: darkWarmTheme,
        light: lightWarmTheme
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
