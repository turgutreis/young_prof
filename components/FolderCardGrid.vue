<template>
  <div v-if="subFolders.length > 0" class="mb-8">
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
          class="islamic-card pa-5 cursor-pointer elevation-3 d-flex flex-column justify-space-between h-100 position-relative"
          elevation="0"
          @click="$emit('select-folder', folder.fullPath)"
        >
          <div class="card-accent-bar"></div>

          <div>
            <div class="d-flex align-start justify-space-between mb-3 pt-1">
              <v-avatar :color="getCategoryColor(folder.name)" size="56" class="elevation-4 rounded-xl">
                <v-icon :icon="getCategoryIcon(folder.name)" color="white" size="30"></v-icon>
              </v-avatar>

              <v-chip size="small" :color="getCategoryColor(folder.name)" variant="tonal" class="font-weight-bold">
                <v-icon icon="mdi-file-multiple-outline" start size="x-small"></v-icon>
                {{ folder.filesCount }} {{ folder.filesCount === 1 ? 'Belge' : 'Belge & Klasör' }}
              </v-chip>
            </div>

            <!-- Title -->
            <h4 class="text-h6 font-weight-bold mb-1" :title="folder.name" style="line-height: 1.35;">
              {{ folder.name }}
            </h4>

            <!-- Islamic Thematic Description -->
            <p class="text-caption text-medium-emphasis mb-3 line-clamp-2" style="line-height: 1.45;">
              {{ getCategoryDescription(folder.name) }}
            </p>
          </div>

          <!-- Bottom Action Link -->
          <div class="d-flex align-center justify-space-between pt-2 border-t border-opacity-10">
            <span class="text-caption font-weight-bold text-secondary d-flex align-center">
              İçeriğe Göz At
              <v-icon icon="mdi-arrow-right" size="small" class="ml-1"></v-icon>
            </span>

            <v-avatar color="secondary" variant="tonal" size="28" rounded="circle">
              <v-icon icon="mdi-chevron-right" size="18"></v-icon>
            </v-avatar>
          </div>
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

function getCategoryIcon(name: string): string {
  const upper = name.toUpperCase()
  if (upper.includes('MÜFREDAT') || upper.includes('MUFREDAT')) return 'mdi-book-open-page-variant-outline'
  if (upper.includes('KİTAP') || upper.includes('KITAP')) return 'mdi-book-heart-outline'
  if (upper.includes('GEZİ') || upper.includes('GEZI')) return 'mdi-map-marker-path'
  if (upper.includes('AKTİVİTE') || upper.includes('AKTIVITE') || upper.includes('ÜNİTE') || upper.includes('UNITE')) return 'mdi-puzzle-star-outline'
  if (upper.includes('DUYURU')) return 'mdi-bullhorn-outline'
  if (upper.includes('MUSIC') || upper.includes('SES') || upper.includes('AUDIO')) return 'mdi-headphones'
  return 'mdi-folder-star-outline'
}

function getCategoryColor(name: string): string {
  const upper = name.toUpperCase()
  if (upper.includes('MÜFREDAT') || upper.includes('MUFREDAT')) return 'emerald-darken-1'
  if (upper.includes('KİTAP') || upper.includes('KITAP')) return 'amber-darken-2'
  if (upper.includes('GEZİ') || upper.includes('GEZI')) return 'indigo-darken-1'
  if (upper.includes('AKTİVİTE') || upper.includes('AKTIVITE') || upper.includes('ÜNİTE') || upper.includes('UNITE')) return 'rose-darken-1'
  if (upper.includes('DUYURU')) return 'cyan-darken-1'
  return 'primary'
}

function getCategoryDescription(name: string): string {
  const upper = name.toUpperCase()
  if (upper.includes('MÜFREDAT') || upper.includes('MUFREDAT')) {
    return 'Haftalık sohbet üniteleri, sunum slaytları, ana metinler ve handout dokümanları.'
  }
  if (upper.includes('KİTAP') || upper.includes('KITAP')) {
    return 'Gençlik için tavsiye edilen temel eserler, okuma listeleri, kaynak kitaplar ve tahliller.'
  }
  if (upper.includes('GEZİ') || upper.includes('GEZI')) {
    return 'Tarihi camiler, külliyeler, ziyaretgahlar ve kültürel gezi rehberleri.'
  }
  if (upper.includes('AKTİVİTE') || upper.includes('AKTIVITE') || upper.includes('ÜNİTE') || upper.includes('UNITE')) {
    return 'İnteraktif Kahoot quizleri, grup atölye çalışmaları ve ünite görevleri.'
  }
  if (upper.includes('DUYURU')) {
    return 'Haftalık sohbet saatleri, seminerler, buluşmalar ve önemli etkinlik duyuruları.'
  }
  return 'Bu klasörün altındaki dokümanları ve alt kategorileri görüntüleyin.'
}
</script>

<style scoped>
.islamic-card:hover .v-avatar {
  transform: scale(1.08) rotate(3deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
