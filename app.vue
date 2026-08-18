<template>
  <v-app>
    <!-- Background Ambient Glow & Girih Islamic Geometry -->
    <div class="bg-ambient-glow"></div>

    <!-- Top Navigation Bar -->
    <v-app-bar flat class="border-b px-4 islamic-card rounded-0" density="comfortable" style="z-index: 10;">
      <v-container class="d-flex align-center max-width-xl pa-0">
        <!-- Logo & Branding -->
        <div class="d-flex align-center cursor-pointer" @click="selectFolder('')">
          <v-avatar color="secondary" class="mr-3 elevation-3" size="44" rounded="lg">
            <v-icon icon="mdi-star-crescent" color="white" size="26"></v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold gradient-text-gold font-cinzel">İlim & Gençlik</h2>
            <div class="text-caption text-medium-emphasis">Sohbet, Müfredat & Kütüphane</div>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Search Input -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Konu, sohbet veya doküman ara..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          density="compact"
          hide-details
          clearable
          rounded="pill"
          class="max-width-340 mx-4 d-none d-sm-flex elevation-1"
        ></v-text-field>

        <!-- Filter Audio Only Toggle -->
        <v-btn
          :color="audioOnlyFilter ? 'primary' : 'surface-variant'"
          :variant="audioOnlyFilter ? 'flat' : 'tonal'"
          size="small"
          rounded="pill"
          class="font-weight-bold mr-2"
          prepend-icon="mdi-headphones"
          @click="audioOnlyFilter = !audioOnlyFilter"
        >
          {{ audioOnlyFilter ? 'Yalnızca Ses' : 'Tüm Dosyalar' }}
        </v-btn>

        <!-- View Mode Switch -->
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          density="compact"
          color="secondary"
          variant="flat"
          rounded="pill"
          class="mr-3 border"
        >
          <v-btn value="grid" icon="mdi-view-grid-outline" size="small"></v-btn>
          <v-btn value="table" icon="mdi-format-list-bulleted" size="small"></v-btn>
        </v-btn-toggle>

        <!-- Theme Toggle Button -->
        <v-btn
          icon
          variant="tonal"
          color="secondary"
          size="small"
          rounded="circle"
          @click="toggleTheme"
        >
          <v-icon :icon="theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"></v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-transparent min-vh-100 pb-16" style="position: relative; z-index: 1;">
      <v-container class="max-width-xl pt-8">
        <!-- Welcoming Islamic Hero Banner -->
        <v-card class="islamic-hero-banner pa-6 pa-md-8 mb-8 elevation-5" elevation="0">
          <v-row align="center">
            <v-col cols="12" md="8">
              <!-- Bismillah Calligraphy Badge -->
              <div class="d-flex align-center mb-2">
                <div class="bismillah-text font-amiri">
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>

              <h1 class="text-h4 text-md-h3 font-weight-extrabold mb-2 font-cinzel">
                İlim, İrfan & <span class="gradient-text-gold">Gençlik Portalı</span>
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-4" style="max-width: 680px; line-height: 1.6;">
                Haftalık sohbet müfredatı, temel kitap tavsiyeleri, tarihi gezi rotaları, interaktif ünite çalışmaları ve güncel duyurularla zenginleştirilmiş ilim meclisi.
              </p>

              <!-- 5 Main Meta Category Quick Chips -->
              <div class="d-flex align-center flex-wrap gap-2">
                <v-chip
                  v-for="cat in mainMetaCategories"
                  :key="cat.name"
                  size="small"
                  variant="flat"
                  :color="selectedFolder.includes(cat.name) ? 'secondary' : 'primary'"
                  class="cursor-pointer font-weight-bold elevation-1"
                  @click="selectFolder(cat.path)"
                >
                  <v-icon :icon="cat.icon" start size="small"></v-icon>
                  {{ cat.name }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="4" class="text-md-right">
              <v-card class="islamic-card pa-4 text-center d-inline-block w-100" style="max-width: 280px;">
                <v-avatar color="secondary" size="56" class="mb-2 elevation-2">
                  <v-icon icon="mdi-library-shelves" size="32" color="white"></v-icon>
                </v-avatar>
                <div class="text-h4 font-weight-bold text-secondary font-cinzel">{{ totalFilesCount }}</div>
                <div class="text-caption font-weight-bold text-medium-emphasis">Mevcut Doküman & Dosya</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Mobile Search Bar -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Konu, sohbet veya doküman ara..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          density="compact"
          hide-details
          clearable
          rounded="pill"
          class="mb-6 d-sm-none elevation-2"
        ></v-text-field>

        <!-- Main Content Area -->
        <v-row>
          <!-- Left Sidebar Folder Tree -->
          <v-col cols="12" md="4" lg="3">
            <FolderTree
              :folder-tree="subFoldersList"
              :selected-path="selectedFolder"
              :total-files="totalFilesCount"
              @select-folder="selectFolder"
            />
          </v-col>

          <!-- Right Content Area -->
          <v-col cols="12" md="8" lg="9">
            <!-- Breadcrumbs -->
            <FolderBreadcrumbs
              :current-path="selectedFolder"
              @select-folder="selectFolder"
            />

            <!-- Duyurular Board (Visible on Root or when Duyurular selected) -->
            <DuyurularBoard v-if="selectedFolder.toUpperCase().includes('DUYURU')" />

            <!-- Loading Spinner -->
            <div v-if="pending" class="d-flex justify-center py-16">
              <v-progress-circular indeterminate color="secondary" size="64" width="6"></v-progress-circular>
            </div>

            <template v-else>
              <!-- Category / Subfolder Cards Grid -->
              <FolderCardGrid
                :sub-folders="subFoldersList"
                @select-folder="selectFolder"
              />

              <!-- PDF & Podcast Files Grid / Table -->
              <PdfCardGrid
                :files="filesList"
                :view-mode="viewMode"
                @preview-file="openPreview"
                @play-audio="playAudio"
              />
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Global Persistent Audio Player Bar -->
    <AudioPlayerBar
      :current-track="activeTrack"
      @close="activeTrack = null"
      @open-pdf="openPreview"
    />

    <!-- PDF Preview Modal -->
    <PdfViewerModal
      v-model="previewModalOpen"
      :file="selectedPreviewFile"
      @play-audio="playAudio"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import type { SohbetFile, FolderNode } from '~/server/api/sohbets/index.get'

const theme = useTheme()

const searchQuery = ref('')
const selectedFolder = ref('')
const viewMode = ref<'grid' | 'table'>('grid')
const audioOnlyFilter = ref(false)

const previewModalOpen = ref(false)
const selectedPreviewFile = ref<SohbetFile | null>(null)
const activeTrack = ref<SohbetFile | null>(null)

// 5 Main Meta Categories
const mainMetaCategories = [
  { name: 'MÜFREDAT', path: 'Müfredat/', icon: 'mdi-book-open-page-variant-outline' },
  { name: 'KİTAP TAVSİYELERİ', path: 'KİTAP TAVSİYELERİ/', icon: 'mdi-book-heart-outline' },
  { name: 'GEZİ GÜZERGAHLARI', path: 'GEZİ GÜZERGAHLARI/', icon: 'mdi-map-marker-path' },
  { name: 'AKTİVİTELER / ÜNİTE ÇALIŞMALARI', path: 'AKTİVİTELER / ÜNİTE ÇALIŞMALARI/', icon: 'mdi-puzzle-star-outline' },
  { name: 'DUYURULAR', path: 'DUYURULAR/', icon: 'mdi-bullhorn-outline' }
]

// Fetch current level Sohbets & Subfolders dynamically from Cloudflare R2
const { data, pending } = await useFetch('/api/sohbets', {
  query: computed(() => ({
    search: searchQuery.value,
    path: selectedFolder.value,
    audioOnly: audioOnlyFilter.value ? 'true' : 'false'
  }))
})

const filesList = computed<SohbetFile[]>(() => data.value?.files || [])
const subFoldersList = computed<FolderNode[]>(() => data.value?.subFolders || [])
const totalFilesCount = computed(() => data.value?.totalFiles || 0)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function selectFolder(path: string) {
  selectedFolder.value = path
}

function openPreview(file: SohbetFile) {
  selectedPreviewFile.value = file
  previewModalOpen.value = true
}

function playAudio(file: SohbetFile) {
  activeTrack.value = file
}
</script>

<style scoped>
.max-width-xl {
  max-width: 1400px;
  margin: 0 auto;
}

.max-width-340 {
  max-width: 340px;
}

.gap-2 {
  gap: 8px;
}
</style>
