import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const islamicDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#07100D', // Deep spiritual emerald-onyx
    surface: '#0F1E19', // Rich dark emerald surface
    'surface-variant': '#162C24',
    primary: '#10B981', // Glowing Emerald
    'primary-darken-1': '#059669',
    secondary: '#D4AF37', // Ottoman Gold / Altın
    accent: '#06B6D4', // Turquoise / Firuze
    error: '#F43F5E',
    info: '#38BDF8',
    success: '#10B981',
    warning: '#F59E0B'
  }
}

const islamicLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FBF8F2', // Warm parchment cream
    surface: '#FFFFFF',
    'surface-variant': '#F2ECE1', // Antique gold parchment
    primary: '#0D5C46', // Noble Ottoman Emerald
    'primary-darken-1': '#094232',
    secondary: '#B45309', // Warm Amber Gold
    accent: '#0284C7',
    error: '#E11D48',
    info: '#0284C7',
    success: '#0D5C46',
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
        dark: islamicDarkTheme,
        light: islamicLightTheme
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
