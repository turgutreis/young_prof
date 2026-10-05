<template>
  <v-dialog
    :model-value="modelValue"
    max-width="1050px"
    height="92vh"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="warm-card d-flex flex-column h-100 pa-0 elevation-6" rounded="xl">
      <!-- Modal Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4 px-6 bg-surface-variant border-b flex-wrap gap-2">
        <div class="d-flex align-center text-truncate pr-4" style="max-width: 500px;">
          <v-avatar color="amber-darken-1" size="38" class="mr-3 elevation-2">
            <v-icon icon="mdi-book-open-page-variant" color="white" size="20"></v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-truncate">{{ file?.name }}</div>
            <div class="text-caption text-medium-emphasis text-truncate">{{ file?.folderPath }}</div>
          </div>
        </div>
        
        <div class="d-flex align-center gap-2">
          <!-- Audio Button inside Viewer -->
          <v-btn
            v-if="file?.hasAudio"
            color="primary"
            variant="flat"
            size="small"
            rounded="pill"
            class="font-weight-bold"
            prepend-icon="mdi-headphones"
            @click="$emit('play-audio', file)"
          >
            Audio
          </v-btn>

          <!-- Open in new tab -->
          <v-btn
            v-if="file?.previewUrl"
            variant="tonal"
            size="small"
            rounded="pill"
            class="font-weight-medium d-none d-sm-inline-flex"
            prepend-icon="mdi-open-in-new"
            :href="file?.previewUrl"
            target="_blank"
          >
            Yeni Sekme
          </v-btn>

          <v-btn
            color="secondary"
            variant="tonal"
            size="small"
            rounded="pill"
            class="font-weight-bold"
            prepend-icon="mdi-download"
            :href="file?.downloadUrl"
            target="_blank"
          >
            İndir
          </v-btn>

          <v-btn
            icon="mdi-close"
            variant="tonal"
            size="small"
            rounded="circle"
            @click="$emit('update:modelValue', false)"
          ></v-btn>
        </div>
      </v-card-title>

      <!-- PDF / Image Viewer Body -->
      <v-card-text class="flex-grow-1 pa-0 position-relative bg-grey-darken-4 d-flex flex-column">
        <div v-if="loading" class="d-flex flex-column align-center justify-center flex-grow-1 py-16">
          <v-progress-circular indeterminate color="primary" size="56" width="5" class="mb-4"></v-progress-circular>
          <span class="text-body-1 font-weight-medium text-medium-emphasis">Dosya yükleniyor...</span>
        </div>

        <!-- Direct Image View if the file is an image -->
        <div
          v-if="isImage"
          class="d-flex align-center justify-center flex-grow-1 pa-4 overflow-auto"
          style="min-height: 500px;"
        >
          <img
            :src="file?.previewUrl"
            :alt="file?.name"
            class="rounded-lg elevation-4"
            style="max-width: 100%; max-height: 80vh; object-fit: contain;"
            @load="loading = false"
            @error="loading = false; loadError = true"
          />
        </div>

        <!-- PDF Iframe -->
        <iframe
          v-else-if="file?.previewUrl && !loadError"
          :src="file.previewUrl"
          class="w-100 flex-grow-1 border-0"
          style="min-height: 600px;"
          @load="loading = false"
          @error="loading = false; loadError = true"
        ></iframe>

        <div v-else class="d-flex flex-column align-center justify-center flex-grow-1 pa-8 text-center">
          <v-icon icon="mdi-alert-circle-outline" color="warning" size="64" class="mb-3"></v-icon>
          <p class="text-h6 font-weight-bold mb-2">Vorschau konnte nicht geladen werden</p>
          <p class="text-body-2 text-medium-emphasis mb-4" style="max-width: 480px;">
            Tarayıcınız bu dosyayı yerleşik görüntüleyicide açamıyor olabilir. Dosyayı doğrudan indirebilir veya yeni sekmede açabilirsiniz.
          </p>
          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              rounded="pill"
              class="font-weight-bold"
              prepend-icon="mdi-download"
              :href="file?.downloadUrl"
            >
              Dosyayı İndir
            </v-btn>
            <v-btn
              v-if="file?.previewUrl"
              variant="outlined"
              rounded="pill"
              class="font-weight-medium"
              prepend-icon="mdi-open-in-new"
              :href="file?.previewUrl"
              target="_blank"
            >
              Yeni Sekmede Aç
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import type { SohbetFile } from '~/server/api/sohbets/index.get'

const props = defineProps<{
  modelValue: boolean
  file: SohbetFile | null
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'play-audio', file: SohbetFile): void
}>()

const loading = ref(true)
const loadError = ref(false)
let timeoutId: any = null

const isImage = computed(() => {
  if (!props.file) return false
  const url = (props.file.previewUrl || props.file.key || props.file.name || '').toLowerCase()
  return (
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.webp') ||
    url.endsWith('.svg') ||
    (props.file as any).fileType === 'image'
  )
})

watch(() => props.file, () => {
  loading.value = true
  loadError.value = false
  if (timeoutId) clearTimeout(timeoutId)
  // Stop spinner after 8 seconds if browser doesn't dispatch iframe load event
  timeoutId = setTimeout(() => {
    loading.value = false
  }, 8000)
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
