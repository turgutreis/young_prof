<template>
  <div class="adminShell">
    <!-- 1. LOGIN SCREEN -->
    <div v-if="!isAuthenticated" class="loginContainer">
      <div class="loginCard">
        <div class="loginHeader">
          <img src="/young-professionals-logo.png" alt="YP Logo" class="loginLogo" />
          <h2>YP Yönetici Paneli</h2>
          <p>İçerikleri ve Cloudflare R2 dosyalarını yönetmek için şifrenizi girin.</p>
        </div>

        <form @submit.prevent="handleLogin" class="loginForm">
          <div class="formGroup">
            <label for="admin-pass">Yönetici Şifresi</label>
            <input
              id="admin-pass"
              v-model="passwordInput"
              type="password"
              placeholder="••••••••••••"
              autocomplete="current-password"
              required
            />
          </div>

          <div v-if="loginError" class="errorAlert">
            {{ loginError }}
          </div>

          <button type="submit" class="primaryBtn" :disabled="isLoggingIn">
            <span v-if="isLoggingIn">Giriş yapılıyor...</span>
            <span v-else>Giriş Yap ➔</span>
          </button>
        </form>

        <div class="loginFooter">
          <NuxtLink to="/">← Ana Sayfaya Dön</NuxtLink>
        </div>
      </div>
    </div>

    <!-- 2. MAIN ADMIN DASHBOARD -->
    <div v-else class="adminLayout">
      <!-- Admin Top Navbar -->
      <header class="adminNavbar">
        <div class="adminNavLeft">
          <NuxtLink to="/" class="navBrand">
            <img src="/young-professionals-logo.png" alt="Logo" class="miniLogo" />
            <b>Young Professionals Admin</b>
          </NuxtLink>
          <span class="statusBadge">☁ Cloudflare R2 Aktif</span>
        </div>

        <div class="adminNavRight">
          <span v-if="content.lastUpdated" class="lastUpdateText">
            Son Kayıt: {{ formatTime(content.lastUpdated) }}
          </span>
          <NuxtLink to="/" target="_blank" class="outlineNavBtn">
            Ana Sayfayı Gör ↗
          </NuxtLink>
          <button class="saveBtn" :disabled="isSaving" @click="saveChanges">
            <span v-if="isSaving">Kaydediliyor...</span>
            <span v-else>💾 Değişiklikleri Kaydet</span>
          </button>
          <button class="logoutBtn" @click="handleLogout" title="Çıkış Yap">
            Çıkış ✕
          </button>
        </div>
      </header>

      <!-- Toast Feedback Message -->
      <div v-if="feedbackMsg" :class="['feedbackToast', feedbackType]">
        {{ feedbackMsg }}
      </div>

      <!-- Uploading Banner / Modal -->
      <div v-if="isUploadingBatch" class="batchUploadBanner">
        <div class="batchSpinner"></div>
        <div>
          <b>Dosyalar Cloudflare R2'ye yükleniyor... ({{ batchProgress.current }} / {{ batchProgress.total }})</b>
          <p>{{ batchProgress.currentFileName }}</p>
        </div>
      </div>

      <div class="adminBody">
        <!-- Sidebar Navigation Tabs -->
        <aside class="adminSidebar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['sidebarTab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="tabIcon">{{ tab.icon }}</span>
            <span class="tabTitle">{{ tab.title }}</span>
          </button>
        </aside>

        <!-- Main Content Editor Area -->
        <main class="adminContent">
          <!-- TAB 1: MÜFREDAT (ZERO-URL DRAG & DROP UX) -->
          <section v-if="activeTab === 'curriculum'" class="editorSection">
            <div class="sectionHeader">
              <div>
                <h2>🎓 Müfredat ve Ders Dosyaları</h2>
                <p>Klasör veya PDF dosyalarınızı sürükleyip bırakın; sistem otomatik olarak R2'ye yükleyip konuyu oluşturur.</p>
              </div>
              <div class="headerActions">
                <button
                  class="syncBtn"
                  :disabled="isSyncing"
                  @click="syncFromR2Bucket"
                  title="Cloudflare R2'deki tüm mevcut klasörleri ve PDF'leri tara"
                >
                  <span v-if="isSyncing">R2 Taranıyor...</span>
                  <span v-else>🔄 R2'yi Tara & Eşitle</span>
                </button>
                <div class="stepSelector">
                  <button
                    v-for="step in curriculumSteps"
                    :key="step"
                    :class="['stepSelectBtn', { active: selectedStep === step }]"
                    @click="selectedStep = step"
                  >
                    {{ step }}
                  </button>
                </div>
              </div>
            </div>

            <!-- MAGIC 1-CLICK FOLDER / FILES DROP ZONE -->
            <div
              class="magicDropZone"
              :class="{ isDraggingOver: isDraggingOverMain }"
              @dragover.prevent="isDraggingOverMain = true"
              @dragleave.prevent="isDraggingOverMain = false"
              @drop.prevent="handleMainDrop"
            >
              <div class="dropZoneIcon">📁</div>
              <div class="dropZoneText">
                <h3>Bir Ders Klasörünü veya PDF'leri Buraya Bırakın</h3>
                <p>
                  Örn: <b>"23 - Kur'an Okuma ve İrtibatımız"</b> klasörünü sürükleyin.
                  İçindeki tüm PDF'ler otomatik tanınır (Ana Metin, Handout, Sunum, Kahoot) ve R2'ye yüklenir.
                </p>
              </div>
              <div class="dropZoneButtons">
                <!-- Folder Picker -->
                <label class="pickerBtn primaryPicker">
                  📂 Klasör Yükle
                  <input
                    type="file"
                    webkitdirectory
                    directory
                    multiple
                    @change="handleFolderSelect"
                    style="display: none;"
                  />
                </label>
                <!-- Multi-File Picker -->
                <label class="pickerBtn">
                  📄 PDF Dosyaları Seç
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    @change="handleFilesSelect"
                    style="display: none;"
                  />
                </label>
              </div>
            </div>

            <!-- Topic Actions Toolbar -->
            <div class="topicToolbar">
              <div class="topicToolbarLeft">
                <button class="addBtn" @click="openNewEmptyTopic">
                  ＋ Boş Konu Ekle ({{ selectedStep }} Basamağı)
                </button>
                <button class="sortBtn" @click="autoSortCurrentStep" title="Konuları numaralarına göre küçükten büyüğe sıralar">
                  🔢 Numaraya Göre Sırala
                </button>
              </div>
              <span class="countBadge">
                Toplam {{ currentStepTopics.length }} Konu Listeleniyor
              </span>
            </div>

            <!-- Topics List with Clean Visual Badges -->
            <div class="topicsList">
              <div
                v-for="(topic, topicIdx) in currentStepTopics"
                :key="topic.no + '-' + topicIdx"
                class="topicItemCard"
              >
                <div class="topicItemHeader">
                  <div class="topicTitleRow">
                    <input
                      v-model="topic.no"
                      type="text"
                      class="topicNoInput"
                      placeholder="No"
                      title="Konu Numarası"
                    />
                    <input
                      v-model="topic.title"
                      type="text"
                      class="topicTitleInput"
                      placeholder="Konu Başlığı"
                    />
                  </div>
                  <div class="topicItemActions">
                    <!-- Quick File Drop or Add for this Topic -->
                    <label class="miniUploadBtn" :title="`${topic.title} konusuna PDF ekle`">
                      ＋ PDF Yükle
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        @change="(e) => handleTopicSpecificUpload(e, topic)"
                        style="display: none;"
                      />
                    </label>
                    <button
                      class="deleteBtn"
                      @click="deleteTopic(topicIdx)"
                      title="Bu Konuyu Sil"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <!-- Topic Visual Files List (Zero URLs!) -->
                <div class="topicFilesContainer">
                  <div v-if="topic.files && topic.files.length" class="visualFilesGrid">
                    <div
                      v-for="(file, fileIdx) in topic.files"
                      :key="fileIdx"
                      class="fileChipCard"
                    >
                      <span :class="['fileTypeBadge', getBadgeClass(file.title)]">
                        {{ getBadgeText(file.title) }}
                      </span>
                      <input
                        v-model="file.title"
                        type="text"
                        class="fileChipTitleInput"
                        placeholder="Dosya Adı"
                      />
                      <div class="fileChipActions">
                        <a
                          :href="file.href"
                          target="_blank"
                          class="chipActionBtn preview"
                          title="Önizle / İndir"
                        >
                          👁
                        </a>
                        <button
                          class="chipActionBtn delete"
                          @click="removeFileFromTopic(topic, fileIdx)"
                          title="Dosyayı Kaldır"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-else class="emptyFilesPlaceholder">
                    <span>Henüz dosya eklenmedi. Yukarıdaki „＋ PDF Yükle“ butonuna tıklayın veya dosyaları buraya sürükleyin.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- TAB 2: DUYURULAR & BULUŞMALAR -->
          <section v-else-if="activeTab === 'news'" class="editorSection">
            <div class="sectionHeader">
              <div>
                <h2>📢 Duyurular ve Dönem Buluşmaları</h2>
                <p>Ana sayfadaki duyuru bandını ve buluşma tarihlerini düzenleyin.</p>
              </div>
            </div>

            <div class="cardBox">
              <h3>Duyuru Kartı Bilgileri</h3>
              <div class="formGrid">
                <div class="formGroup">
                  <label>Üst Başlık (Eyebrow)</label>
                  <input v-model="content.announcement.eyebrow" type="text" />
                </div>
                <div class="formGroup">
                  <label>Ana Başlık</label>
                  <input v-model="content.announcement.title" type="text" />
                </div>
              </div>

              <div class="formGroup fullWidth">
                <label>Açıklama Metni</label>
                <textarea v-model="content.announcement.description" rows="3"></textarea>
              </div>

              <div class="formGrid">
                <div class="formGroup">
                  <label>Buton Metni</label>
                  <input v-model="content.announcement.buttonText" type="text" />
                </div>
                <div class="formGroup">
                  <label>Buton Bağlantısı (E-posta veya Link)</label>
                  <input v-model="content.announcement.buttonHref" type="text" />
                </div>
              </div>

              <h3 style="margin-top: 2rem;">Buluşma Tarihleri</h3>
              <div class="meetingsList">
                <div
                  v-for="(meeting, mIdx) in content.announcement.meetings"
                  :key="mIdx"
                  class="meetingItem"
                >
                  <div class="formGroup">
                    <label>Buluşma Adı</label>
                    <input v-model="meeting.title" type="text" placeholder="Örn. 1. Buluşma" />
                  </div>
                  <div class="formGroup">
                    <label>Gün Aralığı</label>
                    <input v-model="meeting.dateRange" type="text" placeholder="Örn. 16–18" />
                  </div>
                  <div class="formGroup">
                    <label>Ay / Yıl</label>
                    <input v-model="meeting.monthYear" type="text" placeholder="Örn. EKİM 2026" />
                  </div>
                  <button class="deleteBtn" @click="content.announcement.meetings.splice(mIdx, 1)">
                    🗑
                  </button>
                </div>
                <button class="addBtn" @click="content.announcement.meetings.push({ title: 'Yeni Buluşma', dateRange: '01–02', monthYear: 'AY 2026' })">
                  ＋ Yeni Buluşma Tarihi Ekle
                </button>
              </div>
            </div>
          </section>

          <!-- TAB 3: KÜTÜPHANE / LESEPLAN -->
          <section v-else-if="activeTab === 'books'" class="editorSection">
            <div class="sectionHeader">
              <div>
                <h2>📚 Kütüphane ve Okuma Planı Kitapları</h2>
                <p>Okuma planındaki kitapları, kapak resimlerini ve satın alma linklerini yönetin.</p>
              </div>
              <button class="addBtn" @click="addNewBook">
                ＋ Yeni Kitap Ekle
              </button>
            </div>

            <div class="booksGridEditor">
              <div
                v-for="(book, bIdx) in content.readingPlanBooks"
                :key="bIdx"
                class="bookEditorCard"
              >
                <div class="bookCoverPreview">
                  <img :src="book.cover" :alt="book.title" />
                  <label class="uploadCoverLabel">
                    📷 Kapak Resmi Seç
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e) => handleBookCoverUpload(e, bIdx)"
                      style="display: none;"
                    />
                  </label>
                </div>
                <div class="bookFields">
                  <div class="formGroup">
                    <label>Kitap Başlığı</label>
                    <input v-model="book.title" type="text" />
                  </div>
                  <div class="formGroup">
                    <label>Yazar</label>
                    <input v-model="book.author" type="text" />
                  </div>
                  <div class="formGroup">
                    <label>Satın Alma / Detay Linki</label>
                    <input v-model="book.href" type="text" />
                  </div>
                  <button class="deleteBtn" @click="content.readingPlanBooks.splice(bIdx, 1)">
                    🗑 Kitabı Kaldır
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- TAB 4: AKTİVİTELER & PLATFORMLAR -->
          <section v-else-if="activeTab === 'activities'" class="editorSection">
            <div class="sectionHeader">
              <div>
                <h2>👥 Gençlik Platformları ve Seminerler</h2>
                <p>Platform isimlerini ve özel seminer afişlerini yönetin.</p>
              </div>
              <button class="addBtn" @click="addNewPlatform">
                ＋ Yeni Platform Ekle
              </button>
            </div>

            <div class="platformsEditorList">
              <div
                v-for="(plat, pIdx) in content.activityPlatforms"
                :key="pIdx"
                class="platformEditorItem"
              >
                <div class="platformItemRow">
                  <b>{{ String(pIdx + 1).padStart(2, '0') }}</b>
                  <input v-model="content.activityPlatforms[pIdx]" type="text" class="platNameInput" />
                  <button class="deleteBtn" @click="content.activityPlatforms.splice(pIdx, 1)">
                    🗑
                  </button>
                </div>

                <!-- Special detail for this platform if exists -->
                <div class="platformDetailBox" v-if="content.activityPlatformDetails[plat]">
                  <h4>Özel Afiş / Kayıt Bilgisi ({{ plat }})</h4>
                  <div class="formGrid">
                    <div class="formGroup">
                      <label>Afiş Görseli</label>
                      <div class="bannerUploadRow">
                        <img
                          v-if="content.activityPlatformDetails[plat].bannerImage"
                          :src="content.activityPlatformDetails[plat].bannerImage"
                          class="miniBannerPreview"
                        />
                        <label class="miniUploadBtn">
                          📷 Afiş Seç & Yükle
                          <input
                            type="file"
                            accept="image/*"
                            @change="(e) => handlePlatformBannerUpload(e, plat)"
                            style="display: none;"
                          />
                        </label>
                      </div>
                    </div>
                    <div class="formGroup">
                      <label>Kayıt Linki</label>
                      <input v-model="content.activityPlatformDetails[plat].linkHref" type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- TAB 5: GEZİ GÜZERGAHLARI -->
          <section v-else-if="activeTab === 'routes'" class="editorSection">
            <div class="sectionHeader">
              <div>
                <h2>🗺️ Gezi Güzergâhları (Hamburg & Frankfurt)</h2>
                <p>Şehir rehberlerindeki durakları, yemek yerlerini ve camileri düzenleyin.</p>
              </div>
            </div>

            <div class="citiesEditor">
              <div class="cityBox">
                <h3>⚓ Hamburg</h3>
                <h4>Gezilecek Yerler</h4>
                <div v-for="(stop, sIdx) in content.cityGuides.hamburgStops" :key="sIdx" class="cityStopRow">
                  <input v-model="stop.name" type="text" placeholder="Yer Adı" />
                  <input v-model="stop.note" type="text" placeholder="Not (Örn. Seyir terası)" />
                  <input v-model="stop.href" type="text" placeholder="Google Maps Linki" />
                  <button class="deleteBtn" @click="content.cityGuides.hamburgStops.splice(sIdx, 1)">✕</button>
                </div>
                <button class="subtleAddBtn" @click="content.cityGuides.hamburgStops.push({ name: '', note: '', href: '' })">
                  ＋ Hamburg Durağı Ekle
                </button>
              </div>

              <div class="cityBox">
                <h3>🏙️ Frankfurt</h3>
                <h4>Gezilecek Yerler</h4>
                <div v-for="(stop, sIdx) in content.cityGuides.frankfurtStops" :key="sIdx" class="cityStopRow">
                  <input v-model="stop.name" type="text" placeholder="Yer Adı" />
                  <input v-model="stop.note" type="text" placeholder="Not (Örn. Tekne turu)" />
                  <input v-model="stop.href" type="text" placeholder="Google Maps Linki" />
                  <button class="deleteBtn" @click="content.cityGuides.frankfurtStops.splice(sIdx, 1)">✕</button>
                </div>
                <button class="subtleAddBtn" @click="content.cityGuides.frankfurtStops.push({ name: '', note: '', href: '' })">
                  ＋ Frankfurt Durağı Ekle
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SiteContent, CurriculumTopic, CurriculumFile } from '~/types'
import { getInitialSiteContent } from '~/data/initial-content'
import { curriculumSteps } from '~/data/curriculum'
import { sortCurriculumTopics, formatTurkishTitle } from '~/utils/r2'

useSeoMeta({
  title: 'Yönetici Paneli · Young Professionals EU',
  robots: 'noindex, nofollow'
})

const tabs = [
  { id: 'curriculum', title: 'Müfredat & Dosyalar', icon: '🎓' },
  { id: 'news', title: 'Duyurular & Buluşmalar', icon: '📢' },
  { id: 'books', title: 'Kütüphane & Leseplan', icon: '📚' },
  { id: 'activities', title: 'Gençlik Platformları', icon: '👥' },
  { id: 'routes', title: 'Gezi Güzergâhları', icon: '🗺️' }
]

const activeTab = ref('curriculum')
const selectedStep = ref<string>('A')

const isAuthenticated = ref(false)
const passwordInput = ref('')
const isLoggingIn = ref(false)
const loginError = ref('')

const isSaving = ref(false)
const isSyncing = ref(false)
const feedbackMsg = ref('')
const feedbackType = ref<'success' | 'error'>('success')

// Content State
const content = ref<SiteContent>(getInitialSiteContent())

// Drag & Drop State
const isDraggingOverMain = ref(false)
const isUploadingBatch = ref(false)
const batchProgress = ref({
  current: 0,
  total: 0,
  currentFileName: ''
})

const currentStepTopics = computed<CurriculumTopic[]>({
  get() {
    return (content.value.curriculumTopics as any)[selectedStep.value] || []
  },
  set(val) {
    (content.value.curriculumTopics as any)[selectedStep.value] = val
  }
})

function sortAllCurriculumSteps(target: SiteContent = content.value) {
  if (target && target.curriculumTopics) {
    for (const step of Object.keys(target.curriculumTopics)) {
      if (Array.isArray((target.curriculumTopics as any)[step])) {
        ;(target.curriculumTopics as any)[step] = sortCurriculumTopics(
          (target.curriculumTopics as any)[step]
        )
      }
    }
  }
}

function autoSortCurrentStep() {
  if (content.value.curriculumTopics && (content.value.curriculumTopics as any)[selectedStep.value]) {
    (content.value.curriculumTopics as any)[selectedStep.value] = sortCurriculumTopics(
      (content.value.curriculumTopics as any)[selectedStep.value]
    )
    feedbackType.value = 'success'
    feedbackMsg.value = `"${selectedStep.value}" basamağındaki konular numaralarına göre sıralandı!`
    setTimeout(() => { feedbackMsg.value = '' }, 3000)
  }
}

// Lifecycle
onMounted(async () => {
  const storedPass = localStorage.getItem('yp_admin_pass')
  if (storedPass) {
    passwordInput.value = storedPass
    await handleLogin()
  }
})

async function handleLogin() {
  if (!passwordInput.value.trim()) return
  isLoggingIn.value = true
  loginError.value = ''

  try {
    const res = await $fetch<{ success: boolean }>('/api/admin/auth', {
      method: 'POST',
      body: { password: passwordInput.value.trim() }
    })

    if (res.success) {
      isAuthenticated.value = true
      localStorage.setItem('yp_admin_pass', passwordInput.value.trim())
      await loadContent()
    }
  } catch (err: any) {
    loginError.value = err.data?.statusMessage || 'Geçersiz şifre. Lütfen tekrar deneyin.'
    localStorage.removeItem('yp_admin_pass')
  } finally {
    isLoggingIn.value = false
  }
}

function handleLogout() {
  isAuthenticated.value = false
  localStorage.removeItem('yp_admin_pass')
  passwordInput.value = ''
}

async function loadContent() {
  try {
    const data = await $fetch<SiteContent>('/api/content')
    if (data) {
      sortAllCurriculumSteps(data)
      content.value = data
    }
  } catch (err) {
    console.warn('Could not load remote content, using default:', err)
  }
}

async function saveChanges() {
  isSaving.value = true
  feedbackMsg.value = ''

  try {
    sortAllCurriculumSteps()

    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/content', {
      method: 'POST',
      headers: {
        'x-admin-password': passwordInput.value.trim()
      },
      body: content.value
    })

    feedbackType.value = 'success'
    feedbackMsg.value = res.message || 'Başarıyla Cloudflare R2 üzerine kaydedildi!'
    content.value.lastUpdated = new Date().toISOString()
    setTimeout(() => { feedbackMsg.value = '' }, 4000)
  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMsg.value = err.data?.statusMessage || 'Kaydetme sırasında bir hata oluştu.'
  } finally {
    isSaving.value = false
  }
}

function formatTime(isoString?: string) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ' (' + d.toLocaleDateString('tr-TR') + ')'
}

// ==========================================
// 🚀 SMART ZERO-URL DRAG & DROP FOLDER PARSER
// ==========================================

async function handleMainDrop(e: DragEvent) {
  isDraggingOverMain.value = false
  const items = e.dataTransfer?.items
  if (!items || items.length === 0) return

  const entries: any[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.webkitGetAsEntry) {
      const entry = item.webkitGetAsEntry()
      if (entry) entries.push(entry)
    }
  }

  if (entries.length > 0) {
    for (const entry of entries) {
      if (entry.isDirectory) {
        await processDirectoryEntry(entry)
      } else if (entry.isFile) {
        const file = await getFileFromEntry(entry)
        if (file) await uploadSingleOrGroupFiles([file], 'Genel Dosyalar')
      }
    }
  }
}

async function processDirectoryEntry(dirEntry: any) {
  const folderName = dirEntry.name // e.g. "23 - Kur'an Okuma ve İrtibatımız"
  const { no, title, slug } = parseFolderName(folderName)

  const files: File[] = await readAllFilesFromDir(dirEntry)
  if (files.length === 0) return

  await uploadFilesToTopic(files, no, title, slug)
}

function readAllFilesFromDir(dirEntry: any): Promise<File[]> {
  return new Promise((resolve) => {
    const reader = dirEntry.createReader()
    const allFiles: File[] = []

    function readEntries() {
      reader.readEntries(async (entries: any[]) => {
        if (entries.length === 0) {
          resolve(allFiles)
        } else {
          for (const entry of entries) {
            if (entry.isFile) {
              const file = await getFileFromEntry(entry)
              if (file && (file.name.endsWith('.pdf') || file.name.endsWith('.png') || file.name.endsWith('.jpg'))) {
                allFiles.push(file)
              }
            }
          }
          readEntries()
        }
      })
    }
    readEntries()
  })
}

function getFileFromEntry(fileEntry: any): Promise<File | null> {
  return new Promise((resolve) => {
    fileEntry.file((file: File) => resolve(file), () => resolve(null))
  })
}

function parseFolderName(rawName: string): { no: string; title: string; slug: string } {
  const match = rawName.match(/^(\d+)[-_ ]*(.*)$/)
  if (match) {
    const no = match[1].padStart(2, '0')
    const rawTitle = match[2].trim() || `Konu ${no}`
    const title = formatTurkishTitle(rawTitle)
    const slug = `${no}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`
    return { no, title, slug }
  }

  const title = formatTurkishTitle(rawName)
  const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  return { no: '✦', title, slug }
}

async function handleFolderSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  // Determine root folder name from relative path (e.g. "23-kuran-okuma/handout.pdf")
  const firstPath = (files[0] as any).webkitRelativePath || files[0].name
  const folderName = firstPath.includes('/') ? firstPath.split('/')[0] : 'Yeni Konu'
  const { no, title, slug } = parseFolderName(folderName)

  await uploadFilesToTopic(files, no, title, slug)
  target.value = ''
}

async function handleFilesSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  await uploadSingleOrGroupFiles(files, 'Seçilen Dosyalar')
  target.value = ''
}

async function uploadSingleOrGroupFiles(files: File[], defaultTitle: string) {
  const nextNo = String(currentStepTopics.value.length + 1).padStart(2, '0')
  const slug = `${nextNo}-${defaultTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  await uploadFilesToTopic(files, nextNo, defaultTitle, slug)
}

async function uploadFilesToTopic(files: File[], no: string, title: string, slug: string) {
  isUploadingBatch.value = true
  batchProgress.value = { current: 0, total: files.length, currentFileName: '' }

  // Check if topic already exists in currentStepTopics
  let existingTopic = currentStepTopics.value.find(t => t.no === no)
  if (!existingTopic) {
    existingTopic = {
      no,
      title,
      files: []
    }
    currentStepTopics.value.push(existingTopic)
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    batchProgress.value.current = i + 1
    batchProgress.value.currentFileName = file.name

    const targetFolder = `files/${slug}`
    const fileTitle = formatSmartFileTitle(file.name)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', targetFolder)

    try {
      const res = await $fetch<{ success: boolean; key: string; href: string }>('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': passwordInput.value.trim() },
        body: formData
      })

      if (res.success) {
        // Avoid duplicate file entries
        const exists = existingTopic.files.some(f => f.title === fileTitle)
        if (!exists) {
          existingTopic.files.push({
            title: fileTitle,
            href: res.href
          })
        }
      }
    } catch (err: any) {
      console.error('Failed to upload file:', file.name, err)
    }
  }

  isUploadingBatch.value = false
  autoSortCurrentStep()
  feedbackType.value = 'success'
  feedbackMsg.value = `"${title}" konusu ve ${files.length} dosya başarıyla R2'ye yüklendi!`
  setTimeout(() => { feedbackMsg.value = '' }, 4000)
}

function formatSmartFileTitle(fileName: string): string {
  const lower = fileName.toLowerCase()
  if (lower.includes('ana-calisma') || lower.includes('ana_calisma') || lower.includes('ana calisma')) {
    return 'Ana Çalışma Metni'
  }
  if (lower.includes('handout-1')) return 'Handout 1'
  if (lower.includes('handout-2')) return 'Handout 2'
  if (lower.includes('handout')) return 'Handout'
  if (lower.includes('sunum-1')) return 'Sunum 1'
  if (lower.includes('sunum-2')) return 'Sunum 2'
  if (lower.includes('sunum')) return 'Sunum'
  if (lower.includes('kahoot')) return 'Kahoot! Soruları'
  if (lower.includes('ozet')) return 'Özet'
  if (lower.includes('sorularla-anlatim')) return 'Sorularla Anlatım'
  if (lower.includes('sorular')) return 'Sorular'
  if (lower.includes('videolar')) return 'Videolar'
  if (lower.includes('21-lema')) return '21. Lem’a – İhlas Risalesi'

  const base = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  return base.charAt(0).toUpperCase() + base.slice(1)
}

function getBadgeText(title: string): string {
  if (title.includes('Ana')) return '📄 ANA METİN'
  if (title.includes('Handout')) return '📑 HANDOUT'
  if (title.includes('Sunum')) return '📊 SUNUM'
  if (title.includes('Kahoot')) return '❓ KAHOOT'
  if (title.includes('Özet')) return '📝 ÖZET'
  return '📎 PDF'
}

function getBadgeClass(title: string): string {
  if (title.includes('Ana')) return 'badgeAna'
  if (title.includes('Handout')) return 'badgeHandout'
  if (title.includes('Sunum')) return 'badgeSunum'
  if (title.includes('Kahoot')) return 'badgeKahoot'
  return 'badgeDefault'
}

// Topic-specific file upload
async function handleTopicSpecificUpload(e: Event, topic: CurriculumTopic) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  const slug = `${topic.no}-${topic.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

  isUploadingBatch.value = true
  batchProgress.value = { current: 0, total: files.length, currentFileName: '' }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    batchProgress.value.current = i + 1
    batchProgress.value.currentFileName = file.name

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', `files/${slug}`)

    try {
      const res = await $fetch<{ success: boolean; key: string; href: string }>('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': passwordInput.value.trim() },
        body: formData
      })

      if (res.success) {
        topic.files.push({
          title: formatSmartFileTitle(file.name),
          href: res.href
        })
      }
    } catch (err: any) {
      console.error('Upload failed:', err)
    }
  }

  isUploadingBatch.value = false
  target.value = ''
  feedbackType.value = 'success'
  feedbackMsg.value = 'Dosyalar başarıyla eklendi!'
  setTimeout(() => { feedbackMsg.value = '' }, 4000)
}

function removeFileFromTopic(topic: CurriculumTopic, fileIdx: number) {
  topic.files.splice(fileIdx, 1)
}

function deleteTopic(index: number) {
  if (confirm('Bu konuyu ve bağlı dosyalarını silmek istediğinizden emin misiniz?')) {
    currentStepTopics.value.splice(index, 1)
  }
}

function openNewEmptyTopic() {
  const nextNo = String(currentStepTopics.value.length + 1).padStart(2, '0')
  currentStepTopics.value.push({
    no: nextNo,
    title: 'Yeni Konu Başlığı',
    files: []
  })
  autoSortCurrentStep()
}

// ==========================================
// 🔄 R2 BUCKET SCANNER & SYNC
// ==========================================
async function syncFromR2Bucket() {
  isSyncing.value = true
  feedbackMsg.value = ''

  try {
    const res = await $fetch<{ success: boolean; totalFiles: number; topicsCount: number; topics: CurriculumTopic[] }>('/api/admin/sync-r2', {
      method: 'POST',
      headers: { 'x-admin-password': passwordInput.value.trim() }
    })

    if (res.success) {
      // Merge discovered topics into current step or report
      feedbackType.value = 'success'
      feedbackMsg.value = `Cloudflare R2 Tarandı: Toplam ${res.totalFiles} dosya ve ${res.topicsCount} konu bulundu!`
      setTimeout(() => { feedbackMsg.value = '' }, 5000)
    }
  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMsg.value = err.data?.statusMessage || 'R2 taraması başarısız oldu.'
  } finally {
    isSyncing.value = false
  }
}

// Book & Platform actions
function addNewBook() {
  content.value.readingPlanBooks.push({
    title: 'Yeni Kitap',
    author: 'Yazar Adı',
    cover: '/og.png',
    href: 'https://kitapdunyasi.eu'
  })
}

async function handleBookCoverUpload(e: Event, bIdx: number) {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'books/2026-27')

  try {
    const res = await $fetch<{ success: boolean; href: string }>('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': passwordInput.value.trim() },
      body: formData
    })
    if (res.success) {
      content.value.readingPlanBooks[bIdx].cover = res.href
      feedbackType.value = 'success'
      feedbackMsg.value = 'Kapak resmi güncellendi!'
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  } catch (err: any) {
    alert('Kapak resmi yüklenemedi: ' + (err.data?.statusMessage || err.message))
  }
}

function addNewPlatform() {
  content.value.activityPlatforms.push('Yeni Gençlik Platformu')
}

async function handlePlatformBannerUpload(e: Event, plat: string) {
  const target = e.target as HTMLInputElement
  if (!target.files || !target.files[0]) return

  const file = target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'flyers')

  try {
    const res = await $fetch<{ success: boolean; href: string }>('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': passwordInput.value.trim() },
      body: formData
    })
    if (res.success) {
      if (!content.value.activityPlatformDetails[plat]) {
        content.value.activityPlatformDetails[plat] = { name: plat, bannerImage: res.href }
      } else {
        content.value.activityPlatformDetails[plat].bannerImage = res.href
      }
      feedbackType.value = 'success'
      feedbackMsg.value = 'Afiş görseli güncellendi!'
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  } catch (err: any) {
    alert('Afiş yüklenemedi: ' + (err.data?.statusMessage || err.message))
  }
}
</script>

<style scoped>
.adminShell {
  min-height: 100vh;
  background: #0d0d0f;
  color: #ededed;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* LOGIN SCREEN */
.loginContainer {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.loginCard {
  width: 100%;
  max-width: 420px;
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.loginHeader {
  text-align: center;
  margin-bottom: 2rem;
}

.loginLogo {
  width: 64px;
  height: auto;
  margin-bottom: 1rem;
}

.loginHeader h2 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.loginHeader p {
  font-size: 0.875rem;
  color: #888;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

.formGroup label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input, textarea, select {
  background: #202026;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, textarea:focus, select:focus {
  border-color: #3b82f6;
}

.primaryBtn {
  width: 100%;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.primaryBtn:hover {
  background: #1d4ed8;
}

.errorAlert {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid #ef4444;
  color: #fca5a5;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.loginFooter {
  text-align: center;
  margin-top: 1.5rem;
}

.loginFooter a {
  color: #60a5fa;
  text-decoration: none;
  font-size: 0.85rem;
}

/* ADMIN DASHBOARD LAYOUT */
.adminLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.adminNavbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: #16161a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.adminNavLeft {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navBrand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
}

.miniLogo {
  width: 28px;
  height: auto;
}

.statusBadge {
  font-size: 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.adminNavRight {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lastUpdateText {
  font-size: 0.8rem;
  color: #777;
}

.outlineNavBtn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ddd;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.85rem;
  cursor: pointer;
}

.saveBtn {
  background: #10b981;
  color: #fff;
  font-weight: 600;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.saveBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logoutBtn {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.feedbackToast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.feedbackToast.success {
  background: #10b981;
  color: #fff;
}

.feedbackToast.error {
  background: #ef4444;
  color: #fff;
}

/* BATCH UPLOAD OVERLAY */
.batchUploadBanner {
  position: fixed;
  top: 70px;
  right: 2rem;
  background: #2563eb;
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
}

.batchSpinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* BODY & SIDEBAR */
.adminBody {
  display: flex;
  flex: 1;
}

.adminSidebar {
  width: 260px;
  background: #121215;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sidebarTab {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.sidebarTab:hover {
  background: #1c1c22;
  color: #fff;
}

.sidebarTab.active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.adminContent {
  flex: 1;
  padding: 2.5rem 3rem;
  max-width: 1200px;
}

.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1.5rem;
}

.sectionHeader h2 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.3rem;
}

.sectionHeader p {
  color: #777;
  font-size: 0.9rem;
}

.headerActions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.syncBtn {
  background: #1e293b;
  color: #38bdf8;
  border: 1px solid #0284c7;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.syncBtn:hover {
  background: #0284c7;
  color: #fff;
}

.stepSelector {
  display: flex;
  gap: 0.4rem;
}

.stepSelectBtn {
  background: #1c1c22;
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.stepSelectBtn.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

/* 🚀 MAGIC DROP ZONE */
.magicDropZone {
  background: #16161c;
  border: 2px dashed rgba(59, 130, 246, 0.4);
  border-radius: 14px;
  padding: 2.5rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.2s;
}

.magicDropZone.isDraggingOver {
  background: rgba(37, 99, 235, 0.15);
  border-color: #3b82f6;
  transform: scale(1.01);
}

.dropZoneIcon {
  font-size: 2.8rem;
}

.dropZoneText h3 {
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 0.4rem;
}

.dropZoneText p {
  color: #888;
  font-size: 0.9rem;
  max-width: 600px;
  margin: 0 auto;
}

.dropZoneButtons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.pickerBtn {
  background: #202028;
  color: #ddd;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pickerBtn.primaryPicker {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.pickerBtn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.topicToolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.topicToolbarLeft {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.addBtn {
  background: #1e293b;
  color: #94a3b8;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.addBtn:hover {
  background: #334155;
  color: #fff;
}

.sortBtn {
  background: #1e293b;
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 0.6rem 1.1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.88rem;
  transition: all 0.2s;
}

.sortBtn:hover {
  background: #0284c7;
  color: #fff;
}

.countBadge {
  font-size: 0.85rem;
  color: #888;
}

/* TOPICS & VISUAL FILE CHIPS */
.topicsList {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.topicItemCard {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
}

.topicItemHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.topicTitleRow {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.topicNoInput {
  width: 55px;
  text-align: center;
  background: #26262e;
  color: #3b82f6;
  font-weight: 800;
  font-size: 0.95rem;
  border-radius: 6px;
}

.topicTitleInput {
  flex: 1;
  font-weight: 600;
  font-size: 1.05rem;
}

.topicItemActions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.miniUploadBtn {
  background: #1e3a8a;
  color: #93c5fd;
  border: 1px solid #3b82f6;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.deleteBtn {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
}

.topicFilesContainer {
  background: #101013;
  border-radius: 8px;
  padding: 1rem;
}

.visualFilesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.8rem;
}

.fileChipCard {
  background: #1a1a20;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fileTypeBadge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.badgeAna { background: #2563eb; color: #fff; }
.badgeHandout { background: #059669; color: #fff; }
.badgeSunum { background: #d97706; color: #fff; }
.badgeKahoot { background: #7c3aed; color: #fff; }
.badgeDefault { background: #475569; color: #fff; }

.fileChipTitleInput {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.2rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

.fileChipTitleInput:focus {
  background: #24242c;
  border-radius: 4px;
}

.fileChipActions {
  display: flex;
  gap: 0.3rem;
}

.chipActionBtn {
  background: transparent;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.chipActionBtn.preview { color: #60a5fa; text-decoration: none; }
.chipActionBtn.delete { color: #888; }
.chipActionBtn.delete:hover { color: #ef4444; }

.emptyFilesPlaceholder {
  color: #666;
  font-size: 0.85rem;
  text-align: center;
  padding: 0.5rem;
}

/* OTHER TABS (News, Books, etc.) */
.cardBox {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.5rem;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.meetingsList {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.meetingItem {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: #101013;
  padding: 0.8rem;
  border-radius: 8px;
}

.booksGridEditor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.bookEditorCard {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.2rem;
  display: flex;
  gap: 1.2rem;
}

.bookCoverPreview {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bookCoverPreview img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
}

.uploadCoverLabel {
  background: #202026;
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.bookFields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.platformsEditorList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.platformEditorItem {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 1rem;
}

.platformItemRow {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.platNameInput {
  flex: 1;
}

.bannerUploadRow {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.miniBannerPreview {
  height: 50px;
  width: auto;
  border-radius: 4px;
}

.citiesEditor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.cityBox {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cityStopRow {
  display: flex;
  gap: 0.5rem;
}

.subtleAddBtn {
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: #aaa;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>
