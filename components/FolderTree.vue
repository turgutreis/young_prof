<template>
  <v-card class="warm-card pa-4 elevation-2" elevation="0">
    <!-- Header -->
    <div class="d-flex align-center mb-4">
      <v-avatar color="primary" variant="tonal" size="36" class="mr-3">
        <v-icon icon="mdi-folder-heart" color="primary" size="20"></v-icon>
      </v-avatar>
      <div>
        <h3 class="text-subtitle-1 font-weight-bold">Themen & Ordner</h3>
        <div class="text-caption text-medium-emphasis">Ordner-Navigation</div>
      </div>
    </div>

    <v-list density="comfortable" nav class="bg-transparent pa-0">
      <!-- All Files Option -->
      <v-list-item
        :active="selectedPath === ''"
        color="primary"
        rounded="pill"
        class="mb-2 font-weight-semibold"
        @click="$emit('select-folder', '')"
      >
        <template #prepend>
          <v-icon icon="mdi-bookshelf" color="primary" class="mr-2"></v-icon>
        </template>
        <v-list-item-title class="font-weight-bold">Alle Sohbets</v-list-item-title>
        <template #append>
          <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">{{ totalFiles }}</v-chip>
        </template>
      </v-list-item>

      <v-divider class="my-3 border-opacity-25"></v-divider>

      <!-- Main Folders List -->
      <template v-for="node in folderTree" :key="node.fullPath">
        <!-- Direct Item if no preloaded children -->
        <v-list-item
          v-if="!node.children || node.children.length === 0"
          :active="selectedPath === node.fullPath"
          color="primary"
          rounded="lg"
          class="mb-1"
          @click="$emit('select-folder', node.fullPath)"
        >
          <template #prepend>
            <v-icon icon="mdi-folder-text" color="amber-darken-1" class="mr-2"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-truncate" style="font-size: 0.9rem;">
            {{ node.name }}
          </v-list-item-title>
          <template #append>
            <v-chip v-if="node.filesCount > 0" size="x-small" color="amber-darken-2" variant="tonal" class="ml-1 font-weight-bold">
              {{ node.filesCount }}
            </v-chip>
          </template>
        </v-list-item>

        <!-- Nested List Group if children exist -->
        <v-list-group v-else :value="node.fullPath">
          <template #activator="{ props: groupProps }">
            <v-list-item
              v-bind="groupProps"
              :active="selectedPath === node.fullPath"
              color="primary"
              rounded="lg"
              class="mb-1"
              @click="$emit('select-folder', node.fullPath)"
            >
              <template #prepend>
                <v-icon icon="mdi-folder-text" color="amber-darken-1" class="mr-2"></v-icon>
              </template>
              <v-list-item-title class="font-weight-bold text-truncate" style="font-size: 0.9rem;">
                {{ node.name }}
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="child in node.children"
            :key="child.fullPath"
            :active="selectedPath === child.fullPath"
            color="secondary"
            rounded="pill"
            class="ml-3 mb-1 text-caption"
            @click="$emit('select-folder', child.fullPath)"
          >
            <template #prepend>
              <v-icon icon="mdi-bookmark-heart-outline" color="secondary" size="small" class="mr-2"></v-icon>
            </template>
            <v-list-item-title class="font-weight-semibold text-truncate" style="font-size: 0.82rem;">
              {{ child.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
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
