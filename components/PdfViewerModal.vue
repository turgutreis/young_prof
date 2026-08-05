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
            Audio Anhören
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
            Herunterladen
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

      <!-- PDF Viewer Body -->
      <v-card-text class="flex-grow-1 pa-0 position-relative bg-grey-darken-4">
        <div v-if="loading" class="d-flex flex-column align-center justify-center h-100 py-16">
          <v-progress-circular indeterminate color="primary" size="64" width="6" class="mb-4"></v-progress-circular>
          <span class="text-body-1 font-weight-medium text-medium-emphasis">PDF wird geladen...</span>
        </div>

        <iframe
          v-if="file?.previewUrl"
          :src="file.previewUrl"
          class="w-100 h-100 border-0"
          style="min-height: 620px;"
          @load="loading = false"
        ></iframe>

        <div v-else class="d-flex flex-column align-center justify-center h-100 pa-8 text-center">
          <v-icon icon="mdi-alert-circle-outline" color="warning" size="64" class="mb-2"></v-icon>
          <p class="text-body-1 font-weight-medium mb-4">Vorschau für diese Datei konnte nicht direkt geladen werden.</p>
          <v-btn
            color="primary"
            rounded="pill"
            class="font-weight-bold"
            prepend-icon="mdi-download"
            :href="file?.downloadUrl"
          >
            PDF direkt herunterladen
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

watch(() => props.file, () => {
  loading.value = true
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
