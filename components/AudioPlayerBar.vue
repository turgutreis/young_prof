<template>
  <transition name="slide-up">
    <div
      v-if="currentTrack"
      class="audio-player-wrapper fixed-bottom px-4 pb-3 pt-2"
      style="z-index: 1000;"
    >
      <v-card class="warm-card pa-3 px-md-6 elevation-12 border-primary" rounded="pill">
        <!-- Hidden HTML5 Audio Element -->
        <audio
          ref="audioRef"
          :src="currentTrack.audioUrl"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onEnded"
          @play="isPlaying = true"
          @pause="isPlaying = false"
        ></audio>

        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <!-- Left Track Info -->
          <div class="d-flex align-center cursor-pointer max-width-280 text-truncate" @click="$emit('open-pdf', currentTrack)">
            <v-avatar color="primary" size="44" class="mr-3 elevation-3 rounded-circle">
              <v-icon :icon="isPlaying ? 'mdi-waveform' : 'mdi-headphones'" color="white" size="22"></v-icon>
            </v-avatar>
            <div class="text-truncate">
              <div class="text-subtitle-2 font-weight-bold text-truncate" :title="currentTrack.name">
                {{ currentTrack.name }}
              </div>
              <div class="text-caption text-medium-emphasis text-truncate">
                <v-icon icon="mdi-bookmark-music-outline" size="x-small" color="primary" class="mr-1"></v-icon>
                {{ currentTrack.subCategory || currentTrack.category }}
              </div>
            </div>
          </div>

          <!-- Middle Playback Controls & Scrubber -->
          <div class="d-flex flex-column align-center flex-grow-1 mx-md-4" style="max-width: 550px;">
            <div class="d-flex align-center gap-2 mb-1">
              <v-btn
                icon="mdi-skip-backward-10"
                variant="text"
                size="small"
                title="-10 Sekunden"
                @click="seekRelative(-10)"
              ></v-btn>

              <v-btn
                :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
                color="primary"
                variant="flat"
                size="large"
                rounded="circle"
                class="elevation-4"
                @click="togglePlay"
              ></v-btn>

              <v-btn
                icon="mdi-skip-forward-10"
                variant="text"
                size="small"
                title="+10 Sekunden"
                @click="seekRelative(10)"
              ></v-btn>
            </div>

            <!-- Scrubber Slider & Timers -->
            <div class="d-flex align-center w-100 gap-2">
              <span class="text-caption font-weight-medium text-medium-emphasis" style="min-width: 40px; text-align: right;">
                {{ formatTime(currentTime) }}
              </span>

              <v-slider
                v-model="currentTime"
                :max="duration || 100"
                min="0"
                hide-details
                color="primary"
                track-color="surface-variant"
                density="compact"
                class="flex-grow-1"
                @update:model-value="onScrubberChange"
              ></v-slider>

              <span class="text-caption font-weight-medium text-medium-emphasis" style="min-width: 40px;">
                {{ formatTime(duration) }}
              </span>
            </div>
          </div>

          <!-- Right Action Controls -->
          <div class="d-flex align-center gap-2">
            <!-- Speed Switcher -->
            <v-menu location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="tonal"
                  size="small"
                  rounded="pill"
                  color="primary"
                  class="font-weight-bold"
                >
                  {{ playbackRate }}x
                </v-btn>
              </template>
              <v-list density="compact" rounded="lg" class="py-1">
                <v-list-item
                  v-for="rate in [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]"
                  :key="rate"
                  :active="playbackRate === rate"
                  color="primary"
                  @click="setSpeed(rate)"
                >
                  <v-list-item-title class="font-weight-bold">{{ rate }}x</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <!-- PDF Mitlesen Button -->
            <v-btn
              color="secondary"
              variant="flat"
              size="small"
              rounded="pill"
              class="font-weight-bold d-none d-sm-flex"
              prepend-icon="mdi-book-open-variant"
              @click="$emit('open-pdf', currentTrack)"
            >
              PDF Mitlesen
            </v-btn>

            <!-- Close Audio Bar -->
            <v-btn
              icon="mdi-close"
              variant="tonal"
              size="small"
              rounded="circle"
              title="Player schließen"
              @click="closePlayer"
            ></v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { SohbetFile } from '~/server/api/sohbets/index.get'

const props = defineProps<{
  currentTrack: SohbetFile | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-pdf', track: SohbetFile): void
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1.0)

watch(() => props.currentTrack, (newTrack) => {
  if (newTrack) {
    currentTime.value = 0
    duration.value = 0
    isPlaying.value = false
    setTimeout(() => {
      if (audioRef.value) {
        audioRef.value.play().then(() => {
          isPlaying.value = true
          setupMediaSession(newTrack)
        }).catch(err => console.warn('Autoplay blocked:', err))
      }
    }, 100)
  }
})

function togglePlay() {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

function seekRelative(seconds: number) {
  if (!audioRef.value) return
  audioRef.value.currentTime = Math.max(0, Math.min(duration.value, audioRef.value.currentTime + seconds))
}

function onScrubberChange(val: number) {
  if (!audioRef.value) return
  audioRef.value.currentTime = val
}

function setSpeed(rate: number) {
  playbackRate.value = rate
  if (audioRef.value) {
    audioRef.value.playbackRate = rate
  }
}

function onTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

function onLoadedMetadata() {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

function onEnded() {
  isPlaying.value = false
}

function closePlayer() {
  if (audioRef.value) {
    audioRef.value.pause()
  }
  emit('close')
}

function formatTime(secs: number): string {
  if (!secs || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

function setupMediaSession(track: SohbetFile) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name.replace(/\.pdf$/i, ''),
      artist: track.subCategory || track.category,
      album: 'Sohbet Archiv Podcast'
    })

    navigator.mediaSession.setActionHandler('play', () => togglePlay())
    navigator.mediaSession.setActionHandler('pause', () => togglePlay())
    navigator.mediaSession.setActionHandler('seekbackward', () => seekRelative(-10))
    navigator.mediaSession.setActionHandler('seekforward', () => seekRelative(10))
  }
}

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<style scoped>
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.max-width-280 {
  max-width: 280px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
