<template>
  <v-app>
    <!-- Background Ambient Glow -->
    <div class="bg-ambient-glow"></div>

    <!-- Top Navigation Bar -->
    <v-app-bar flat class="border-b px-4 warm-card rounded-0" density="comfortable" style="z-index: 10;">
      <v-container class="d-flex align-center max-width-xl pa-0">
        <div class="d-flex align-center cursor-pointer" @click="selectFolder('')">
          <v-avatar color="amber-darken-1" class="mr-3 elevation-3" size="42">
            <v-icon icon="mdi-book-heart-outline" color="white" size="24"></v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h6 font-weight-bold gradient-text-warm">Sohbet Archiv</h2>
            <div class="text-caption text-medium-emphasis">PDF Bibliothek & Wissensportal</div>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Search Input -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Welche Sohbet suchst du?"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          density="compact"
          hide-details
          clearable
          rounded="pill"
          class="max-width-320 mx-4 d-none d-sm-flex elevation-1"
        ></v-text-field>

        <!-- View Mode Switch -->
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          density="compact"
          color="primary"
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
          color="primary"
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
        <!-- Welcoming Hero Banner -->
        <v-card class="hero-warm-banner pa-6 pa-md-8 mb-8 elevation-4" elevation="0">
          <v-row align="center">
            <v-col cols="12" md="8">
              <div class="d-flex align-center flex-wrap gap-2 mb-3">
                <v-chip color="primary" variant="flat" size="small" class="font-weight-bold">
                  <v-icon icon="mdi-sparkles" start size="small"></v-icon> Willkommen
                </v-chip>
                <v-chip color="secondary" variant="tonal" size="small" class="font-weight-bold">
                  <v-icon icon="mdi-folder-heart-outline" start size="small"></v-icon> Cloudflare R2 Storage
                </v-chip>
              </div>

              <h1 class="text-h4 text-md-h3 font-weight-extrabold mb-3">
                Entdecke & lerne mit <span class="gradient-text-warm">Sohbet-Unterlagen</span>
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-4" style="max-width: 650px;">
                Eine friedliche, übersichtliche Bibliothek für deine Themen-Sohbets, Gençlik Müfredatı und Unterrichtsmaterialien. Alles direkt im Browser lesen oder herunterladen.
              </p>

              <!-- Quick Tag Badges -->
              <div class="d-flex align-center flex-wrap gap-2">
                <v-chip
                  v-for="cat in quickCategories"
                  :key="cat.path"
                  size="small"
                  variant="outlined"
                  color="primary"
                  class="cursor-pointer font-weight-medium"
                  @click="selectFolder(cat.path)"
                >
                  <v-icon icon="mdi-bookmark-outline" start size="x-small"></v-icon>
                  {{ cat.label }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="12" md="4" class="text-md-right">
              <v-card class="warm-card pa-4 text-center d-inline-block w-100" style="max-width: 280px;">
                <v-avatar color="primary" size="56" class="mb-2 elevation-2">
                  <v-icon icon="mdi-file-document-multiple-outline" size="32" color="white"></v-icon>
                </v-avatar>
                <div class="text-h4 font-weight-bold primary--text">{{ totalFilesCount }}</div>
                <div class="text-caption font-weight-semibold text-medium-emphasis">PDF-Dokumente bereit</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Mobile Search Bar -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Welche Sohbet suchst du?"
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
              :folder-tree="folderTree"
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

            <!-- Loading Spinner -->
            <div v-if="pending" class="d-flex justify-center py-16">
              <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
            </div>

            <!-- PDF Grid / Table -->
            <PdfCardGrid
              v-else
              :files="filesList"
              :view-mode="viewMode"
              @preview-file="openPreview"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- PDF Preview Modal -->
    <PdfViewerModal
      v-model="previewModalOpen"
      :file="selectedPreviewFile"
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

const previewModalOpen = ref(false)
const selectedPreviewFile = ref<SohbetFile | null>(null)

const quickCategories = [
  { label: 'Gençlik Müfredatı', path: 'sohbets/INT - SYF - GENCLIK MFRDT/' },
  { label: 'Namaz İbadeti', path: 'sohbets/INT - SYF - GENCLIK MFRDT/A - NAMAZ IBADETİ VE KAZANDIRDIKLARI/' },
  { label: 'Ahlak & Karakter', path: 'sohbets/INT - SYF - GENCLIK MFRDT/B - AHLAK VE KARAKTER/' },
  { label: 'İnanç Esasları', path: 'sohbets/INT - SYF - GENCLIK MFRDT/C - INANC ESASLARI/' }
]

// Fetch Sohbets from Nuxt Server API
const { data, pending } = await useFetch('/api/sohbets', {
  query: computed(() => ({
    search: searchQuery.value,
    path: selectedFolder.value
  }))
})

const filesList = computed<SohbetFile[]>(() => data.value?.files || [])
const folderTree = computed<FolderNode[]>(() => data.value?.folderTree || [])
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
</script>

<style scoped>
.max-width-xl {
  max-width: 1400px;
  margin: 0 auto;
}

.max-width-320 {
  max-width: 320px;
}

.gap-2 {
  gap: 8px;
}
</style>
