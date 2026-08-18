<template>
  <v-card class="islamic-card pa-4 elevation-2" elevation="0">
    <!-- Header -->
    <div class="d-flex align-center mb-4">
      <v-avatar color="secondary" variant="tonal" size="36" class="mr-3">
        <v-icon icon="mdi-folder-star-multiple-outline" color="secondary" size="20"></v-icon>
      </v-avatar>
      <div>
        <h3 class="text-subtitle-1 font-weight-bold font-cinzel">İlim Meclisleri</h3>
        <div class="text-caption text-medium-emphasis">Kategori Gezgini</div>
      </div>
    </div>

    <v-list density="comfortable" nav class="bg-transparent pa-0">
      <!-- All Files Option -->
      <v-list-item
        link
        :active="selectedPath === ''"
        color="secondary"
        rounded="pill"
        class="mb-2 font-weight-semibold"
        @click="$emit('select-folder', '')"
      >
        <template #prepend>
          <v-icon icon="mdi-bookshelf" color="secondary" class="mr-2"></v-icon>
        </template>
        <v-list-item-title class="font-weight-bold">Ana Sayfa (Tümü)</v-list-item-title>
        <template #append>
          <v-chip size="x-small" color="secondary" variant="flat" class="font-weight-bold">{{ totalFiles }}</v-chip>
        </template>
      </v-list-item>

      <v-divider class="my-3 border-opacity-25"></v-divider>

      <!-- Main Folders List -->
      <template v-for="node in folderTree" :key="node.fullPath">
        <v-list-item
          link
          :active="selectedPath === node.fullPath"
          color="secondary"
          rounded="lg"
          class="mb-1"
          @click="$emit('select-folder', node.fullPath)"
        >
          <template #prepend>
            <v-icon icon="mdi-folder-text-outline" color="secondary" class="mr-2"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-truncate" style="font-size: 0.9rem;">
            {{ node.name }}
          </v-list-item-title>
          <template #append>
            <v-chip v-if="node.filesCount > 0" size="x-small" color="secondary" variant="tonal" class="ml-1 font-weight-bold">
              {{ node.filesCount }}
            </v-chip>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { FolderNode } from '~/server/api/sohbets/index.get'

defineProps<{
  folderTree: FolderNode[]
  selectedPath: string
  totalFiles: number
}>()

defineEmits<{
  (e: 'select-folder', path: string): void
}>()
</script>
