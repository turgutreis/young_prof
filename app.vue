<template>
  <v-app>
    <!-- Background Ambient Glow & Girih Islamic Geometry -->
    <div class="bg-ambient-glow"></div>

    <!-- Top Navigation Bar -->
    <v-app-bar flat class="border-b px-4 islamic-card rounded-0" density="comfortable" style="z-index: 10;">
      <v-container class="d-flex align-center max-width-xl pa-0">
        <!-- Logo & Branding -->
        <div class="d-flex align-center cursor-pointer mr-3" @click="selectFolder('')">
          <div class="d-flex align-center bg-white px-3 py-1 rounded-lg elevation-2 mr-3" style="height: 44px;">
            <img
              src="/logo.png"
              alt="Young Professionals Logo"
              style="height: 34px; width: auto; object-fit: contain;"
            />
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Filter Audio Only Toggle -->
        <!-- <v-btn
          :color="audioOnlyFilter ? 'primary' : 'surface-variant'"
          :variant="audioOnlyFilter ? 'flat' : 'tonal'"
          size="small"
          rounded="pill"
          class="font-weight-bold mr-2"
          prepend-icon="mdi-headphones"
          @click="audioOnlyFilter = !audioOnlyFilter"
        >
          {{ audioOnlyFilter ? 'Yalnızca Ses' : 'Tüm Dosyalar' }}
        </v-btn> -->
        <!-- Theme Toggle Button -->
      </v-container>
    </v-app-bar>

    <v-main class="bg-transparent min-vh-100 pb-16" style="position: relative; z-index: 1;">
      <v-container class="max-width-xl pt-8">
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

          <!-- Right Content Area -->
          <v-col cols="12" md="8" lg="9">
            <!-- Breadcrumbs -->
            <FolderBreadcrumbs
              :current-path="selectedFolder"
              @select-folder="selectFolder"
            />

            <!-- Duyurular Board (Visible when Duyurular selected) -->
            <DuyurularBoard v-if="selectedFolder.toUpperCase().includes('DUYURU')" />

            <!-- Loading Spinner -->
            <div v-if="pending" class="d-flex justify-center py-16">
              <v-progress-circular indeterminate color="secondary" size="64" width="6"></v-progress-circular>
            </div>

            <template v-else>
              <!-- Category / Subfolder Cards Grid (When subfolders exist) -->
              <FolderCardGrid
                v-if="subFoldersList.length > 0"
                :sub-folders="subFoldersList"
                @select-folder="selectFolder"
              />

              <!-- PDF & Podcast Files Grid / Table (When files exist) -->
              <PdfCardGrid
                v-if="filesList.length > 0"
                :files="filesList"
                :view-mode="viewMode"
                @preview-file="openPreview"
                @play-audio="playAudio"
              />

              <!-- Truly Empty State (Only when NEITHER subfolders NOR files exist) -->
              <v-card
                v-if="subFoldersList.length === 0 && filesList.length === 0"
                class="islamic-card text-center pa-12 elevation-2"
              >
                <v-avatar color="secondary" variant="tonal" size="72" class="mb-4">
                  <v-icon icon="mdi-folder-search-outline" size="40" color="secondary"></v-icon>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold mb-2">Henüz İçerik Bulunmuyor</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Bu klasörde henüz doküman veya alt kategori bulunmamaktadır.
                </p>
                <v-btn
                  color="secondary"
                  variant="flat"
                  size="small"
                  rounded="pill"
                  prepend-icon="mdi-arrow-left"
                  @click="selectFolder('')"
                >
                  Ana Sayfaya Dön
                </v-btn>
              </v-card>
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
