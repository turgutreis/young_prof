<template>
  <div v-if="subFolders.length > 0" class="mb-6">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center">
        <v-icon icon="mdi-folder-grid-outline" color="primary" class="mr-2"></v-icon>
        <h3 class="text-subtitle-1 font-weight-bold">Unterordner & Kategorien</h3>
      </div>
      <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold">
        {{ subFolders.length }} Ordner
      </v-chip>
    </div>

    <v-row>
      <v-col
        v-for="folder in subFolders"
        :key="folder.fullPath"
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <v-card
          class="warm-card pa-4 cursor-pointer elevation-2 d-flex align-center justify-space-between h-100"
          elevation="0"
          @click="$emit('select-folder', folder.fullPath)"
        >
          <div class="card-accent-bar"></div>

          <div class="d-flex align-center text-truncate pr-2 pt-1">
            <v-avatar color="amber-darken-1" size="44" class="mr-3 elevation-3 rounded-lg">
              <v-icon icon="mdi-folder-heart-outline" color="white" size="24"></v-icon>
            </v-avatar>
            <div class="text-truncate">
              <h4 class="text-subtitle-1 font-weight-bold text-truncate mb-0" :title="folder.name">
                {{ folder.name }}
              </h4>
              <div class="d-flex align-center text-caption text-medium-emphasis mt-1">
                <v-icon icon="mdi-file-document-multiple-outline" size="x-small" color="primary" class="mr-1"></v-icon>
                <span>{{ folder.filesCount }} {{ folder.filesCount === 1 ? 'Datei' : 'Dateien' }}</span>
              </div>
            </div>
          </div>

          <v-avatar color="primary" variant="tonal" size="32" rounded="circle">
            <v-icon icon="mdi-arrow-right" size="18"></v-icon>
          </v-avatar>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { FolderNode } from '~/server/api/sohbets/index.get'

defineProps<{
  subFolders: FolderNode[]
}>()

defineEmits<{
  (e: 'select-folder', path: string): void
}>()
</script>

<style scoped>
.warm-card:hover .v-avatar {
  transform: scale(1.08);
  transition: transform 0.2s ease;
}
</style>
