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
          <!-- TAB 1: MÜFREDAT -->
          <section v-if="activeTab === 'curriculum'" class="editorSection">
            <div class="sectionHeader">
              <div>
                <h2>🎓 Müfredat ve Ders Dosyaları</h2>
                <p>Basamaklara göre konuları, PDF çalışma metinlerini ve sunumları yönetin.</p>
              </div>
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

            <!-- Topic Actions -->
            <div class="topicToolbar">
              <button class="addBtn" @click="openAddTopicModal">
                ＋ Yeni Konu Ekle ({{ selectedStep }} Basamağı)
              </button>
              <span class="countBadge">
                Toplam {{ currentStepTopics.length }} Konu
              </span>
            </div>

            <!-- Topics List -->
            <div class="topicsList">
              <div
                v-for="(topic, topicIdx) in currentStepTopics"
                :key="topic.no + '-' + topicIdx"
                class="topicItemCard"
              >
                <div class="topicItemHeader">
                  <div class="topicTitleRow">
                    <span class="topicItemNo">No: {{ topic.no }}</span>
                    <input
                      v-model="topic.title"
                      type="text"
                      class="topicTitleInput"
                      placeholder="Konu Başlığı"
                    />
                  </div>
                  <div class="topicItemActions">
                    <button
                      class="fileAddBtn"
                      @click="openFileUploadForTopic(topic)"
                      title="Bu konuya PDF veya dosya yükle"
                    >
                      ☁ R2 Dosya Yükle
                    </button>
                    <button
                      class="deleteBtn"
                      @click="deleteTopic(topicIdx)"
                      title="Konuyu Sil"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <!-- Topic Files Accordion / List -->
                <div class="topicFiles">
                  <div
                    v-for="(file, fileIdx) in topic.files"
                    :key="fileIdx"
                    class="topicFileRow"
                  >
                    <span class="pdfTag">PDF</span>
                    <input
                      v-model="file.title"
                      type="text"
                      class="fileTitleInput"
                      placeholder="Dosya Başlığı (Örn. Ana Çalışma Metni)"
                    />
                    <input
                      v-model="file.href"
                      type="text"
                      class="fileHrefInput"
                      placeholder="R2 Akış URL'si veya Dosya Yolu"
                    />
                    <a
                      :href="file.href"
                      target="_blank"
                      class="previewFileLink"
                      title="Önizle"
                    >
                      ↗
                    </a>
                    <button
                      class="removeFileBtn"
                      @click="removeFileFromTopic(topic, fileIdx)"
                      title="Dosyayı Kaldır"
                    >
                      ✕
                    </button>
                  </div>

                  <div class="addFileToolbar">
                    <button class="subtleAddBtn" @click="addManualFileToTopic(topic)">
                      ＋ Manuel Dosya Satırı Ekle
                    </button>
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
                  <button class="uploadCoverBtn" @click="triggerBookCoverUpload(bIdx)">
                    📷 Kapağı Değiştir
                  </button>
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
                  <div class="formGroup">
                    <label>Kapak R2 URL'si</label>
                    <input v-model="book.cover" type="text" />
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
                      <label>Afiş Görseli URL'si</label>
                      <input v-model="content.activityPlatformDetails[plat].bannerImage" type="text" />
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

      <!-- File Upload Modal -->
      <div v-if="uploadModalOpen" class="modalOverlay" @click.self="uploadModalOpen = false">
        <div class="uploadModal">
          <div class="modalHeader">
            <h3>Cloudflare R2'ye Dosya Yükle</h3>
            <button class="closeModalBtn" @click="uploadModalOpen = false">✕</button>
          </div>

          <div class="modalBody">
            <div class="formGroup">
              <label>Hedef Klasör (Cloudflare R2)</label>
              <input v-model="uploadFolder" type="text" placeholder="files/01-sohbet-i-canan" />
            </div>

            <div class="formGroup">
              <label>Özel Dosya Adı (İsteğe bağlı)</label>
              <input v-model="uploadCustomName" type="text" placeholder="ana-calisma-metni.pdf" />
            </div>

            <div class="dropZone">
              <input type="file" ref="fileInputRef" @change="onFileSelected" />
              <p v-if="!selectedUploadFile">Dosyayı seçin veya buraya bırakın (PDF, PNG, JPG)</p>
              <p v-else>Seçilen dosya: <b>{{ selectedUploadFile.name }}</b> ({{ (selectedUploadFile.size / 1024).toFixed(1) }} KB)</p>
            </div>

            <div v-if="uploadError" class="errorAlert">{{ uploadError }}</div>
          </div>

          <div class="modalFooter">
            <button class="outlineNavBtn" @click="uploadModalOpen = false">İptal</button>
            <button class="saveBtn" :disabled="!selectedUploadFile || isUploading" @click="submitFileUpload">
              <span v-if="isUploading">Yükleniyor...</span>
              <span v-else>R2'ye Yükle ☁</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SiteContent, CurriculumTopic, BookItem } from '~/types'
import { getInitialSiteContent } from '~/data/initial-content'
import { curriculumSteps } from '~/data/curriculum'

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
const feedbackMsg = ref('')
const feedbackType = ref<'success' | 'error'>('success')

// Content State
const content = ref<SiteContent>(getInitialSiteContent())

// Upload State
const uploadModalOpen = ref(false)
const uploadFolder = ref('files/uploads')
const uploadCustomName = ref('')
const selectedUploadFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadError = ref('')
const targetTopicForUpload = ref<CurriculumTopic | null>(null)
const targetBookIdxForUpload = ref<number | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const currentStepTopics = computed<CurriculumTopic[]>({
  get() {
    return (content.value.curriculumTopics as any)[selectedStep.value] || []
  },
  set(val) {
    (content.value.curriculumTopics as any)[selectedStep.value] = val
  }
})

// Lifecycle
onMounted(async () => {
  // Check if session exists in cookie or localStorage
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
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/content', {
      method: 'POST',
      headers: {
        'x-admin-password': passwordInput.value.trim()
      },
      body: content.value
    })

    feedbackType.value = 'success'
    feedbackMsg.value = res.message || 'Başarıyla kaydedildi!'
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

// Topic actions
function openAddTopicModal() {
  const nextNo = String(currentStepTopics.value.length + 1).padStart(2, '0')
  currentStepTopics.value.push({
    no: nextNo,
    title: 'Yeni Konu Başlığı',
    files: []
  })
}

function deleteTopic(index: number) {
  if (confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
    currentStepTopics.value.splice(index, 1)
  }
}

function addManualFileToTopic(topic: CurriculumTopic) {
  topic.files.push({
    title: 'Yeni Doküman',
    href: ''
  })
}

function removeFileFromTopic(topic: CurriculumTopic, fileIdx: number) {
  topic.files.splice(fileIdx, 1)
}

function openFileUploadForTopic(topic: CurriculumTopic) {
  targetTopicForUpload.value = topic
  targetBookIdxForUpload.value = null
  const slug = topic.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  uploadFolder.value = `files/${topic.no}-${slug}`
  uploadCustomName.value = 'ana-calisma-metni.pdf'
  selectedUploadFile.value = null
  uploadError.value = ''
  uploadModalOpen.value = true
}

function triggerBookCoverUpload(bIdx: number) {
  targetBookIdxForUpload.value = bIdx
  targetTopicForUpload.value = null
  uploadFolder.value = 'books/2026-27'
  uploadCustomName.value = ''
  selectedUploadFile.value = null
  uploadError.value = ''
  uploadModalOpen.value = true
}

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedUploadFile.value = target.files[0]
  }
}

async function submitFileUpload() {
  if (!selectedUploadFile.value) return
  isUploading.value = true
  uploadError.value = ''

  const formData = new FormData()
  formData.append('file', selectedUploadFile.value)
  formData.append('folder', uploadFolder.value)
  if (uploadCustomName.value.trim()) {
    formData.append('customFilename', uploadCustomName.value.trim())
  }

  try {
    const res = await $fetch<{ success: boolean; key: string; href: string; fileName: string }>('/api/admin/upload', {
      method: 'POST',
      headers: {
        'x-admin-password': passwordInput.value.trim()
      },
      body: formData
    })

    if (res.success) {
      if (targetTopicForUpload.value) {
        targetTopicForUpload.value.files.push({
          title: uploadCustomName.value || res.fileName,
          href: res.href
        })
      } else if (targetBookIdxForUpload.value !== null) {
        content.value.readingPlanBooks[targetBookIdxForUpload.value].cover = res.href
      }

      uploadModalOpen.value = false
      feedbackType.value = 'success'
      feedbackMsg.value = `Dosya R2'ye yüklendi: ${res.key}`
      setTimeout(() => { feedbackMsg.value = '' }, 4000)
    }
  } catch (err: any) {
    uploadError.value = err.data?.statusMessage || 'Yükleme başarısız oldu.'
  } finally {
    isUploading.value = false
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

function addNewPlatform() {
  content.value.activityPlatforms.push('Yeni Gençlik Platformu')
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
  align-items: center;
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

.topicToolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.addBtn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.countBadge {
  font-size: 0.85rem;
  color: #888;
}

.topicsList {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.topicItemCard {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.2rem;
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

.topicItemNo {
  background: #26262e;
  color: #3b82f6;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

.topicTitleInput {
  flex: 1;
  font-weight: 600;
}

.topicItemActions {
  display: flex;
  gap: 0.5rem;
}

.fileAddBtn {
  background: #1e3a8a;
  color: #93c5fd;
  border: 1px solid #3b82f6;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}

.deleteBtn {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

.topicFiles {
  background: #101013;
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.topicFileRow {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pdfTag {
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.fileTitleInput {
  width: 220px;
}

.fileHrefInput {
  flex: 1;
}

.previewFileLink {
  color: #60a5fa;
  text-decoration: none;
  font-size: 1.1rem;
}

.removeFileBtn {
  background: transparent;
  color: #888;
  border: none;
  cursor: pointer;
}

.removeFileBtn:hover {
  color: #ef4444;
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

.uploadCoverBtn {
  background: #202026;
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.3rem;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
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

/* MODAL */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.uploadModal {
  background: #18181c;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.closeModalBtn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
}

.dropZone {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.dropZone input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.modalFooter {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
</style>
