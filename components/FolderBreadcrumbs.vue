<template>
  <v-breadcrumbs
    :items="breadcrumbItems"
    class="px-0 py-2 text-body-2"
  >
    <template #divider>
      <v-icon icon="mdi-chevron-right" size="small" color="primary"></v-icon>
    </template>
    
    <template #title="{ item }">
      <v-btn
        variant="text"
        density="compact"
        class="text-none font-weight-medium"
        :color="item.disabled ? 'primary' : undefined"
        @click="$emit('select-folder', item.raw.path)"
      >
        <v-icon :icon="item.raw.icon" size="small" class="mr-1"></v-icon>
        {{ item.title }}
      </v-btn>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
  title: string
  path: string
  icon: string
  disabled: boolean
}

const props = defineProps<{
  currentPath: string
}>()

defineEmits<{
  (e: 'select-folder', path: string): void
}>()

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    {
      title: 'Alle Sohbets',
      path: '',
      icon: 'mdi-folder-home-outline',
      disabled: !props.currentPath
    }
  ]

  if (!props.currentPath) return items

  const parts = props.currentPath.split('/').filter(Boolean)
  let accumulatedPath = ''

  parts.forEach((part, index) => {
    accumulatedPath += `${part}/`
    const isLast = index === parts.length - 1
    items.push({
      title: part,
      path: accumulatedPath,
      icon: isLast ? 'mdi-folder-open-outline' : 'mdi-folder-outline',
      disabled: isLast
    })
  })

  return items
})
</script>
