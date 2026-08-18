<template>
  <div v-if="files.length > 0" class="mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <v-avatar color="secondary" variant="tonal" size="38" class="mr-3">
          <v-icon icon="mdi-file-document-multiple-outline" color="secondary" size="22"></v-icon>
        </v-avatar>
        <div>
          <h3 class="text-h6 font-weight-bold font-cinzel">Dokümanlar & Dosyalar</h3>
          <div class="text-caption text-medium-emphasis">Bu kategorideki materyaller ve ses kayıtları</div>
        </div>
      </div>
      <v-chip size="small" color="secondary" variant="tonal" class="font-weight-bold">
        {{ files.length }} Dosya
      </v-chip>
    </div>

    <!-- Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="file in files"
        :key="file.key"
        cols="12"
        sm="6"
        md="6"
        lg="4"
      >
        <v-card class="islamic-card d-flex flex-column h-100 pa-5 elevation-2" elevation="0">
          <div class="card-accent-bar"></div>

          <!-- Top Badges -->
          <div class="d-flex align-start justify-space-between mb-4 pt-1">
            <v-avatar :color="getFileBadgeColor(file)" size="46" rounded="lg" class="elevation-3">
              <v-icon :icon="getFileIcon(file)" size="28" color="white"></v-icon>
            </v-avatar>

            <div class="d-flex flex-column align-end gap-1">
              <v-chip size="x-small" :color="getFileBadgeColor(file)" variant="flat" class="font-weight-bold text-uppercase">
                {{ file.fileType || 'Dosya' }}
              </v-chip>
              <v-chip v-if="file.hasAudio" size="x-small" color="primary" variant="tonal" class="font-weight-bold">
                <v-icon icon="mdi-headphones" start size="x-small"></v-icon> {{ file.durationLabel || 'Ses Kaydı' }}
              </v-chip>
            </div>
          </div>

          <!-- Title & Subcategory -->
          <div class="mb-4 flex-grow-1">
            <h4 class="text-subtitle-1 font-weight-bold mb-2 line-clamp-2" :title="file.name" style="line-height: 1.35;">
              {{ file.name }}
            </h4>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon icon="mdi-folder-open-outline" size="x-small" color="primary" class="mr-1"></v-icon>
              <span class="text-truncate font-weight-medium">{{ file.folderPath }}</span>
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
          <div class="d-flex flex-wrap gap-2">
            <!-- Audio Play Button -->
            <v-btn
              v-if="file.hasAudio"
              color="primary"
              variant="flat"
              size="small"
              rounded="pill"
              class="font-weight-bold flex-grow-1"
              prepend-icon="mdi-play-circle"
              @click="$emit('play-audio', file)"
            >
              Dinle
            </v-btn>

            <!-- Preview Button (For PDF / Images) -->
            <v-btn
              v-if="file.previewUrl"
              color="secondary"
              :variant="file.hasAudio ? 'tonal' : 'flat'"
              size="small"
              rounded="pill"
              class="font-weight-bold flex-grow-1"
              prepend-icon="mdi-eye-outline"
              @click="$emit('preview-file', file)"
            >
              Göz At
            </v-btn>

            <v-btn
              color="surface-variant"
              variant="tonal"
              size="small"
              rounded="circle"
              icon="mdi-download"
              :href="file.downloadUrl"
              target="_blank"
              title="İndir"
            ></v-btn>

            <v-btn
              variant="outlined"
              size="small"
              rounded="circle"
              icon="mdi-share-variant-outline"
              title="Bağlantıyı Kopyala"
              @click="copyLink(file)"
            ></v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Table View -->
    <v-card v-else class="islamic-card pa-0 elevation-2" elevation="0">
      <v-table class="bg-transparent">
        <thead>
          <tr>
            <th class="font-weight-bold">Başlık & Konum</th>
            <th class="font-weight-bold">Format</th>
            <th class="font-weight-bold">Boyut</th>
            <th class="font-weight-bold">Tarih</th>
            <th class="text-right font-weight-bold">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.key">
            <td>
              <div class="d-flex align-center py-3">
                <v-avatar :color="getFileBadgeColor(file)" size="36" rounded="lg" class="mr-3">
                  <v-icon :icon="getFileIcon(file)" color="white" size="20"></v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ file.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ file.folderPath }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex gap-1">
                <v-chip size="x-small" :color="getFileBadgeColor(file)" variant="flat" class="font-weight-bold text-uppercase">
                  {{ file.fileType }}
                </v-chip>
                <v-chip v-if="file.hasAudio" size="x-small" color="primary" variant="tonal" class="font-weight-bold">
                  Ses
                </v-chip>
              </div>
            </td>
            <td class="text-caption font-weight-medium">{{ formatFileSize(file.size) }}</td>
            <td class="text-caption text-medium-emphasis">{{ formatDate(file.lastModified) }}</td>
            <td class="text-right">
              <v-btn
                v-if="file.hasAudio"
                icon="mdi-play-circle"
                variant="flat"
                size="small"
                color="primary"
                rounded="circle"
                class="mr-1"
                title="Ses Dinle"
                @click="$emit('play-audio', file)"
              ></v-btn>
              <v-btn
                v-if="file.previewUrl"
                icon="mdi-eye-outline"
                variant="tonal"
                size="small"
                color="secondary"
                rounded="circle"
                class="mr-1"
                title="Önizle"
                @click="$emit('preview-file', file)"
              ></v-btn>
              <v-btn
                icon="mdi-download"
                variant="outlined"
                size="small"
                rounded="circle"
                class="mr-1"
                :href="file.downloadUrl"
                target="_blank"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Copy Snackbar Notification -->
    <v-snackbar v-model="snackbar" timeout="3000" color="success" location="bottom right" rounded="pill">
      <v-icon icon="mdi-check-circle-outline" class="mr-2"></v-icon>
      Bağlantı panoya kopyalandı!
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
  (e: 'play-audio', file: SohbetFile): void
}>()

const snackbar = ref(false)

function getFileIcon(file: SohbetFile): string {
  if (file.fileType === 'pdf') return 'mdi-file-pdf-box'
  if (file.fileType === 'audio') return 'mdi-headphones'
  if (file.fileType === 'image') return 'mdi-image'
  if (file.fileType === 'doc') return 'mdi-file-document-outline'
  return 'mdi-file-outline'
}

function getFileBadgeColor(file: SohbetFile): string {
  if (file.fileType === 'pdf') return 'amber-darken-1'
  if (file.fileType === 'audio') return 'primary'
  if (file.fileType === 'image') return 'indigo'
  if (file.fileType === 'doc') return 'secondary'
  return 'surface-variant'
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
