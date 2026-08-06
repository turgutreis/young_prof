<template>
  <div v-if="subFolders.length > 0" class="mb-6">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-folder-grid-outline" color="primary" class="mr-2" size="large"></v-icon>
        <h3 class="text-h6 font-weight-extrabold">Kategorien & Ordner</h3>
      </div>
      <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">
        {{ subFolders.length }} Ordner
      </v-chip>
    </div>

    <v-row>
      <v-col
        v-for="folder in subFolders"
        :key="folder.fullPath"
        cols="12"
        sm="6"
        md="6"
        lg="6"
      >
        <v-card
          class="warm-card pa-5 cursor-pointer elevation-3 d-flex align-center justify-space-between h-100 position-relative"
          elevation="0"
          @click="$emit('select-folder', folder.fullPath)"
        >
          <div class="card-accent-bar"></div>

          <div class="d-flex align-center text-truncate pr-3 pt-1">
            <v-avatar :color="getFolderColor(folder.name)" size="52" class="mr-4 elevation-4 rounded-xl">
              <v-icon :icon="getFolderIcon(folder.name)" color="white" size="28"></v-icon>
            </v-avatar>

            <div class="text-truncate">
              <h4 class="text-h6 font-weight-bold text-truncate mb-1" :title="folder.name" style="line-height: 1.3;">
                {{ folder.name }}
              </h4>
              <div class="d-flex align-center text-caption text-medium-emphasis">
                <v-icon icon="mdi-file-document-multiple-outline" size="x-small" color="primary" class="mr-1"></v-icon>
                <span class="font-weight-medium">{{ folder.filesCount }} {{ folder.filesCount === 1 ? 'Datei / Ordner' : 'Dateien / Ordner' }}</span>
              </div>
            </div>
          </div>

          <v-btn
            icon="mdi-arrow-right"
            color="primary"
            variant="tonal"
            size="small"
            rounded="circle"
            class="elevation-1"
          ></v-btn>
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

function getFolderIcon(name: string): string {
  const upper = name.toUpperCase()
  if (upper.includes('MÜFREDAT')) return 'mdi-school-outline'
  if (upper.includes('KİTAP') || upper.includes('KITAP')) return 'mdi-book-open-page-variant-outline'
  if (upper.includes('GEZİ') || upper.includes('GEZI')) return 'mdi-map-marker-path'
  if (upper.includes('AKTİVİTE') || upper.includes('AKTIVITE') || upper.includes('ÜNİTE')) return 'mdi-puzzle-outline'
  return 'mdi-folder-heart-outline'
}

function getFolderColor(name: string): string {
  const upper = name.toUpperCase()
  if (upper.includes('MÜFREDAT')) return 'amber-darken-1'
  if (upper.includes('KİTAP') || upper.includes('KITAP')) return 'emerald'
  if (upper.includes('GEZİ') || upper.includes('GEZI')) return 'indigo'
  if (upper.includes('AKTİVİTE') || upper.includes('AKTIVITE') || upper.includes('ÜNİTE')) return 'rose'
  return 'primary'
}
</script>

<style scoped>
.warm-card:hover .v-avatar {
  transform: scale(1.08);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
