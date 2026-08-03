<template>
  <div>
    <!-- Empty State -->
    <v-card v-if="files.length === 0" class="warm-card text-center pa-12 elevation-2">
      <v-avatar color="primary" variant="tonal" size="80" class="mb-4">
        <v-icon icon="mdi-book-search-outline" size="48" color="primary"></v-icon>
      </v-avatar>
      <h3 class="text-h5 font-weight-bold mb-2">Keine Sohbets gefunden</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Für deinen ausgewählten Ordner oder Suchbegriff gibt es noch keine Dokumente.
      </p>
    </v-card>

    <!-- Grid View -->
    <v-row v-else-if="viewMode === 'grid'">
      <v-col
        v-for="file in files"
        :key="file.key"
        cols="12"
        sm="6"
        md="6"
        lg="4"
      >
        <v-card class="warm-card d-flex flex-column h-100 pa-5 elevation-2" elevation="0">
          <div class="card-accent-bar"></div>

          <!-- Top Badge & File Format -->
          <div class="d-flex align-start justify-space-between mb-4 pt-1">
            <v-avatar color="amber-darken-1" size="46" rounded="lg" class="elevation-3">
              <v-icon icon="mdi-file-pdf-box" size="30" color="white"></v-icon>
            </v-avatar>

            <v-chip size="small" color="secondary" variant="flat" class="font-weight-bold">
              <v-icon icon="mdi-check-circle" start size="x-small"></v-icon> PDF Dokument
            </v-chip>
          </div>

          <!-- Title & Subcategory -->
          <div class="mb-4 flex-grow-1">
            <h4 class="text-subtitle-1 font-weight-bold mb-2 line-clamp-2" :title="file.name" style="line-height: 1.35;">
              {{ file.name }}
            </h4>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon icon="mdi-folder-open-outline" size="x-small" color="primary" class="mr-1"></v-icon>
              <span class="text-truncate font-weight-medium">{{ file.subCategory || file.category }}</span>
            </div>
          </div>

          <v-divider class="my-3 border-opacity-25"></v-divider>

          <!-- File Info Footer -->
          <div class="d-flex align-center justify-space-between text-caption text-medium-emphasis mb-4">
            <span class="d-flex align-center">
              <v-icon icon="mdi-harddisk-outline" size="x-small" class="mr-1"></v-icon>
              {{ formatFileSize(file.size) }}
            </span>
            <span class="d-flex align-center">
              <v-icon icon="mdi-calendar-blank-outline" size="x-small" class="mr-1"></v-icon>
              {{ formatDate(file.lastModified) }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              rounded="pill"
              class="flex-grow-1 font-weight-bold"
              prepend-icon="mdi-eye-outline"
              @click="$emit('preview-file', file)"
            >
              Vorschau
            </v-btn>

            <v-btn
              color="secondary"
              variant="tonal"
              size="small"
              rounded="circle"
              icon="mdi-download"
              :href="file.downloadUrl"
              target="_blank"
              title="Herunterladen"
            ></v-btn>

            <v-btn
              variant="outlined"
              size="small"
              rounded="circle"
              icon="mdi-share-variant-outline"
              title="Link kopieren"
              @click="copyLink(file)"
            ></v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table View -->
    <v-card v-else class="warm-card pa-0 elevation-2" elevation="0">
      <v-table class="bg-transparent">
        <thead>
          <tr>
            <th class="font-weight-bold">Titel & Pfad</th>
            <th class="font-weight-bold">Kategorie</th>
            <th class="font-weight-bold">Größe</th>
            <th class="font-weight-bold">Datum</th>
            <th class="text-right font-weight-bold">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.key">
            <td>
              <div class="d-flex align-center py-3">
                <v-avatar color="amber-darken-1" size="36" rounded="lg" class="mr-3">
                  <v-icon icon="mdi-file-pdf-box" color="white" size="20"></v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ file.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ file.folderPath }}</div>
                </div>
              </div>
            </td>
            <td>
              <v-chip size="x-small" color="secondary" variant="flat" class="font-weight-bold">
                {{ file.subCategory }}
              </v-chip>
            </td>
            <td class="text-caption font-weight-medium">{{ formatFileSize(file.size) }}</td>
            <td class="text-caption text-medium-emphasis">{{ formatDate(file.lastModified) }}</td>
            <td class="text-right">
              <v-btn
                icon="mdi-eye-outline"
                variant="tonal"
                size="small"
                color="primary"
                rounded="circle"
                class="mr-1"
                @click="$emit('preview-file', file)"
              ></v-btn>
              <v-btn
                icon="mdi-download"
                variant="tonal"
                size="small"
                color="secondary"
                rounded="circle"
                class="mr-1"
                :href="file.downloadUrl"
                target="_blank"
              ></v-btn>
              <v-btn
                icon="mdi-content-copy"
                variant="outlined"
                size="small"
                rounded="circle"
                @click="copyLink(file)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Copy Snackbar Notification -->
    <v-snackbar v-model="snackbar" timeout="3000" color="success" location="bottom right" rounded="pill">
      <v-icon icon="mdi-check-circle-outline" class="mr-2"></v-icon>
      Sohbet Download-Link kopiert!
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SohbetFile } from '~/server/api/sohbets/index.get'

defineProps<{
  files: SohbetFile[]
  viewMode: 'grid' | 'table'
}>()

defineEmits<{
  (e: 'preview-file', file: SohbetFile): void
}>()

const snackbar = ref(false)

function formatFileSize(bytes: number): string {
  if (!bytes) return '1.5 MB'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function copyLink(file: SohbetFile) {
  const fullUrl = window.location.origin + file.downloadUrl
  navigator.clipboard.writeText(fullUrl)
  snackbar.value = true
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 8px;
}
</style>
