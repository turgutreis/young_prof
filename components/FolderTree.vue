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
