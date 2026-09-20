<template>
  <div class="adminShell">
    <!-- 1. LOGIN SCREEN -->
    <div v-if="!isAuthenticated" class="loginContainer">
      <div class="loginCard">
        <div class="loginHeader">
          <img src="/young-professionals-logo.png" alt="YP Logo" class="loginLogo" />
          <div class="loginTitleRow">
            <h2>YP Yönetici Paneli</h2>
            <span class="versionBadge">v2.2.0</span>
          </div>
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
          <span class="versionBadge">v2.2.0</span>
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
        <!-- Sidebar Navigation Drawer: Expand on Hover & Rail Mode -->
        <v-navigation-drawer
          theme="dark"
          expand-on-hover
          rail
          permanent
          :rail-width="72"
          :width="260"
          class="customAdminDrawer"
        >
          <v-list density="comfortable" nav class="drawerNavList">
            <v-list-item
              v-for="tab in tabs"
              :key="tab.id"
              :value="tab.id"
              :active="activeTab === tab.id"
              @click="activeTab = tab.id"
              class="drawerNavItem"
              :class="{ activeTabItem: activeTab === tab.id }"
            >
              <template #prepend>
                <span class="drawerTabIcon">{{ tab.icon }}</span>
              </template>
              <v-list-item-title class="drawerTabTitle">{{ tab.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

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

            <!-- Topic Actions & Search Toolbar -->
            <div class="topicToolbar">
              <div class="topicToolbarLeft">
                <button class="addBtn" @click="openNewEmptyTopic">
                  ＋ Boş Konu Ekle ({{ selectedStep }} Basamağı)
                </button>
                <button class="sortBtn" @click="autoSortCurrentStep" title="Konuları numaralarına göre küçükten büyüğe sıralar">
                  🔢 Numaraya Göre Sırala
                </button>
              </div>
              <div class="topicToolbarRight">
                <div class="adminSearchBox">
                  <span class="searchIcon">🔍</span>
                  <input
                    v-model="adminTopicSearch"
                    type="text"
                    placeholder="Konu ara (örn: İhlas, 23, Namaz)..."
                    class="adminSearchInput"
                  />
                  <button
                    v-if="adminTopicSearch"
                    class="clearSearchBtn"
                    @click="adminTopicSearch = ''"
                    title="Aramayı Temizle"
                  >
                    ✕
                  </button>
                </div>
                <span class="countBadge">
                  Toplam {{ currentStepTopics.length }} Konu
                </span>
              </div>
            </div>

            <!-- Modern Vuetify Data Table with Single Expanded Slot -->
            <div class="adminTableCard">
              <v-data-table
                theme="dark"
                v-model:expanded="expandedTopicRows"
                :headers="topicTableHeaders"
                :items="currentStepTopics"
                :search="adminTopicSearch"
                item-value="no"
                expand-strategy="single"
                show-expand
                hover
                class="customAdminTable"
                :items-per-page="50"
                density="comfortable"
              >
                <!-- Column: No -->
                <template #item.no="{ item }">
                  <span class="tableNoBadge">{{ (item as any).no }}</span>
                </template>

                <!-- Column: Title -->
                <template #item.title="{ item }">
                  <div class="tableTitleCell">
                    <b>{{ (item as any).title }}</b>
                  </div>
                </template>

                <!-- Column: Files Count -->
                <template #item.files="{ item }">
                  <span :class="['tableFileCountBadge', { hasFiles: (item as any).files && (item as any).files.length > 0 }]">
                    {{ (item as any).files ? (item as any).files.length : 0 }} PDF
                  </span>
                </template>

                <!-- Column: File Type Preview Tags -->
                <template #item.previewChips="{ item }">
                  <div v-if="(item as any).files && (item as any).files.length" class="tableChipsRow">
                    <span
                      v-for="(f, fIdx) in (item as any).files.slice(0, 4)"
                      :key="fIdx"
                      :class="['miniFileChip', getBadgeClass(f.title)]"
                      :title="f.title"
                    >
                      {{ getBadgeText(f.title).replace(/📄|📑|📊|❓|📝|📎/g, '').trim() }}
                    </span>
                    <span v-if="(item as any).files.length > 4" class="miniFileMore">
                      +{{ (item as any).files.length - 4 }}
                    </span>
                  </div>
                  <span v-else class="noFilesText">Dosya yok</span>
                </template>

                <!-- Column: Actions -->
                <template #item.actions="{ item }">
                  <div class="tableActionsRow">
                    <label class="miniUploadBtn" :title="`${(item as any).title} konusuna PDF ekle`" @click.stop>
                      <span class="btnPlus">＋</span>
                      <span class="btnText">PDF</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        @change="(e) => handleTopicSpecificUpload(e, item as any)"
                        style="display: none;"
                      />
                    </label>
                    <button
                      class="deleteBtn"
                      @click.stop="confirmDeleteTopic(item as any)"
                      title="Bu Konuyu Sil"
                    >
                      🗑
                    </button>
                  </div>
                </template>

                <!-- EXPANDED ROW SLOT (SINGLE ROW EXPAND) -->
                <template #expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length" class="expandedDetailCell">
                      <div class="expandedTopicContainer">
                        <!-- Quick Editor Header -->
                        <div class="expandedTopicHeader">
                          <div class="expandedEditRow">
                            <label class="expandedInputGroup">
                              <span class="inputLabel">Konu No:</span>
                              <input
                                v-model="(item as any).no"
                                type="text"
                                class="topicNoInput"
                                placeholder="No"
                              />
                            </label>
                            <label class="expandedInputGroup titleGroup">
                              <span class="inputLabel">Konu Başlığı:</span>
                              <input
                                v-model="(item as any).title"
                                type="text"
                                class="topicTitleInput"
                                placeholder="Konu Başlığı"
                              />
                            </label>
                          </div>
                          <div class="expandedHeaderActions">
                            <label class="pickerBtn primaryPicker miniPicker">
                              📂 Bu Konuya PDF Yükle
                              <input
                                type="file"
                                multiple
                                accept=".pdf"
                                @change="(e) => handleTopicSpecificUpload(e, item as any)"
                                style="display: none;"
                              />
                            </label>
                          </div>
                        </div>

                        <!-- Visual File Chips Grid Inside Expanded Row -->
                        <div class="expandedFilesBox">
                          <div v-if="(item as any).files && (item as any).files.length" class="visualFilesGrid">
                            <div
                              v-for="(file, fileIdx) in (item as any).files"
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
                                  @click="confirmRemoveFile(item as any, fileIdx)"
                                  title="Dosyayı Kaldır"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                          <div v-else class="emptyFilesPlaceholder">
                            <span>Bu konuya henüz dosya eklenmedi. Yukarıdaki „📂 Bu Konuya PDF Yükle“ butonuna tıklayın veya dosyaları sürükleyin.</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
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
                  <button class="deleteBtn" @click="confirmDeleteMeeting(mIdx)">
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
                  <button class="deleteBtn" @click="confirmDeleteBook(bIdx)">
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
                  <button class="deleteBtn" @click="confirmDeletePlatform(pIdx)">
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
                  <button class="deleteBtn" @click="confirmDeleteCityStop('hamburg', sIdx)">✕</button>
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
                  <button class="deleteBtn" @click="confirmDeleteCityStop('frankfurt', sIdx)">✕</button>
                </div>
                <button class="subtleAddBtn" @click="content.cityGuides.frankfurtStops.push({ name: '', note: '', href: '' })">
                  ＋ Frankfurt Durağı Ekle
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <!-- REUSABLE CONFIRMATION / DELETE MODAL -->
      <v-dialog
        v-model="confirmDialog.isOpen"
        max-width="480px"
        transition="dialog-top-transition"
        class="confirmDeleteModal"
      >
        <v-card class="confirmCard" theme="dark">
          <div class="confirmCardHeader">
            <div class="confirmIconWrapper">
              <span class="confirmIcon">{{ confirmDialog.icon || '🗑️' }}</span>
            </div>
            <div class="confirmHeaderInfo">
              <h3 class="confirmTitle">{{ confirmDialog.title }}</h3>
              <p class="confirmSubtitle">{{ confirmDialog.message }}</p>
            </div>
          </div>

          <v-card-text v-if="confirmDialog.itemName || confirmDialog.itemSubtext" class="confirmCardBody">
            <div v-if="confirmDialog.itemName" class="confirmTargetBox">
              <span class="confirmTargetLabel">Seçilen Öğe:</span>
              <strong class="confirmTargetName">{{ confirmDialog.itemName }}</strong>
            </div>
            <p v-if="confirmDialog.itemSubtext" class="confirmSubtext">
              {{ confirmDialog.itemSubtext }}
            </p>
          </v-card-text>

          <v-card-actions class="confirmCardActions">
            <v-spacer />
            <button
              type="button"
              class="confirmBtn cancelBtn"
              @click="confirmDialog.isOpen = false"
            >
              {{ confirmDialog.cancelText || 'Vazgeç' }}
            </button>
            <button
              type="button"
              class="confirmBtn dangerBtn"
              @click="handleConfirmDialogAction"
            >
              {{ confirmDialog.confirmText || 'Evet, Sil' }}
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

// Data Table State & Headers
const adminTopicSearch = ref('')
const expandedTopicRows = ref<string[]>([])

const topicTableHeaders = [
  { title: '#', key: 'no', width: '75px', sortable: true },
  { title: 'Konu Başlığı', key: 'title', sortable: true },
  { title: 'Dosya', key: 'files', width: '100px', sortable: false },
  { title: 'Mevcut Dosyalar', key: 'previewChips', sortable: false },
  { title: 'İşlemler', key: 'actions', width: '150px', sortable: false, align: 'end' as const }
]

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

// ==========================================
// 🛡️ CONFIRMATION / DELETE DIALOG SYSTEM
// ==========================================
interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  itemName?: string
  itemSubtext?: string
  confirmText?: string
  cancelText?: string
  icon?: string
  onConfirm: () => void | Promise<void>
}

const confirmDialog = ref<ConfirmDialogState>({
  isOpen: false,
  title: '',
  message: '',
  itemName: '',
  itemSubtext: '',
  confirmText: 'Evet, Sil',
  cancelText: 'Vazgeç',
  icon: '🗑️',
  onConfirm: () => {}
})

function triggerConfirm(options: {
  title: string
  message: string
  itemName?: string
  itemSubtext?: string
  confirmText?: string
  cancelText?: string
  icon?: string
  onConfirm: () => void | Promise<void>
}) {
  confirmDialog.value = {
    isOpen: true,
    title: options.title,
    message: options.message,
    itemName: options.itemName || '',
    itemSubtext: options.itemSubtext || '',
    confirmText: options.confirmText || 'Evet, Sil',
    cancelText: options.cancelText || 'Vazgeç',
    icon: options.icon || '🗑️',
    onConfirm: options.onConfirm
  }
}

async function handleConfirmDialogAction() {
  const cb = confirmDialog.value.onConfirm
  confirmDialog.value.isOpen = false
  if (cb) {
    await cb()
  }
}

function confirmDeleteTopic(topic: CurriculumTopic) {
  const fileCount = topic.files ? topic.files.length : 0
  triggerConfirm({
    title: 'Konuyu Sil',
    message: 'Bu konuyu ve bağlı tüm dosyalarını silmek istediğinizden emin misiniz?',
    itemName: `#${topic.no} - ${topic.title}`,
    itemSubtext: fileCount > 0 ? `⚠️ Bu konuya ait ${fileCount} adet dosya da listeden silinecektir.` : undefined,
    confirmText: 'Evet, Konuyu Sil',
    icon: '🗑️',
    onConfirm: () => {
      const idx = currentStepTopics.value.findIndex(t => t.no === topic.no && t.title === topic.title)
      if (idx !== -1) {
        currentStepTopics.value.splice(idx, 1)
        feedbackType.value = 'success'
        feedbackMsg.value = `"${topic.title}" konusu silindi.`
        setTimeout(() => { feedbackMsg.value = '' }, 3000)
      }
    }
  })
}

function confirmRemoveFile(topic: CurriculumTopic, fileIdx: number) {
  const file = topic.files[fileIdx]
  triggerConfirm({
    title: 'Dosyayı Kaldır',
    message: `"${topic.title}" konusuna bağlı bu dosyayı listeden kaldırmak istiyor musunuz?`,
    itemName: file ? file.title : 'Dosya',
    confirmText: 'Evet, Kaldır',
    icon: '📄',
    onConfirm: () => {
      topic.files.splice(fileIdx, 1)
      feedbackType.value = 'success'
      feedbackMsg.value = `"${file?.title || 'Dosya'}" kaldırıldı.`
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  })
}

function confirmDeleteMeeting(mIdx: number) {
  const meeting = content.value.announcement.meetings[mIdx]
  triggerConfirm({
    title: 'Buluşma Tarihini Sil',
    message: 'Bu buluşma tarihini listeden silmek istediğinizden emin misiniz?',
    itemName: meeting ? `${meeting.title} (${meeting.dateRange} ${meeting.monthYear})` : 'Buluşma',
    confirmText: 'Evet, Sil',
    icon: '📅',
    onConfirm: () => {
      content.value.announcement.meetings.splice(mIdx, 1)
      feedbackType.value = 'success'
      feedbackMsg.value = 'Buluşma tarihi silindi.'
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  })
}

function confirmDeleteBook(bIdx: number) {
  const book = content.value.readingPlanBooks[bIdx]
  triggerConfirm({
    title: 'Kitabı Kaldır',
    message: 'Bu kitabı okuma planından silmek istediğinizden emin misiniz?',
    itemName: book ? `${book.title} (${book.author})` : 'Kitap',
    confirmText: 'Evet, Kitabı Sil',
    icon: '📚',
    onConfirm: () => {
      content.value.readingPlanBooks.splice(bIdx, 1)
      feedbackType.value = 'success'
      feedbackMsg.value = `"${book?.title || 'Kitap'}" silindi.`
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  })
}

function confirmDeletePlatform(pIdx: number) {
  const plat = content.value.activityPlatforms[pIdx]
  triggerConfirm({
    title: 'Platformu Sil',
    message: 'Bu gençlik platformunu listeden silmek istediğinizden emin misiniz?',
    itemName: plat,
    confirmText: 'Evet, Sil',
    icon: '👥',
    onConfirm: () => {
      content.value.activityPlatforms.splice(pIdx, 1)
      feedbackType.value = 'success'
      feedbackMsg.value = `"${plat}" platformu silindi.`
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  })
}

function confirmDeleteCityStop(city: 'hamburg' | 'frankfurt', sIdx: number) {
  const stops = city === 'hamburg' ? content.value.cityGuides.hamburgStops : content.value.cityGuides.frankfurtStops
  const stop = stops[sIdx]
  const cityName = city === 'hamburg' ? 'Hamburg' : 'Frankfurt'
  triggerConfirm({
    title: `${cityName} Gezi Durağını Sil`,
    message: `Bu durağı ${cityName} gezi rehberinden silmek istediğinizden emin misiniz?`,
    itemName: stop?.name || 'Durak',
    confirmText: 'Evet, Sil',
    icon: '🗺️',
    onConfirm: () => {
      stops.splice(sIdx, 1)
      feedbackType.value = 'success'
      feedbackMsg.value = `${cityName} durağı silindi.`
      setTimeout(() => { feedbackMsg.value = '' }, 3000)
    }
  })
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

.loginTitleRow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.versionBadge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #94a3b8;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
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

/* BODY & NAVIGATION DRAWER (EXPAND ON HOVER) */
.adminBody {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 70px);
  position: relative;
}

:deep(.customAdminDrawer) {
  background: #121216 !important;
  border-right: 1px solid #282834 !important;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4) !important;
  z-index: 100 !important;
  top: 70px !important;
  height: calc(100vh - 70px) !important;
}

:deep(.drawerNavList) {
  padding: 1.2rem 0.5rem !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem !important;
}

:deep(.drawerNavItem) {
  border-radius: 8px !important;
  color: #94a3b8 !important;
  padding: 0.7rem 0.8rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

:deep(.drawerNavItem:hover) {
  background: #1c1c28 !important;
  color: #fff !important;
}

:deep(.drawerNavItem.activeTabItem),
:deep(.drawerNavItem.v-list-item--active) {
  background: #2563eb !important;
  color: #fff !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;
}

:deep(.drawerTabIcon) {
  font-size: 1.35rem;
  margin-right: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

:deep(.drawerTabTitle) {
  font-size: 0.92rem !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
}

.adminContent {
  flex: 1;
  padding: 2rem 2.5rem;
  margin-left: 72px;
  max-width: 1450px;
  width: calc(100% - 72px);
  transition: all 0.2s ease;
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
  white-space: nowrap;
}

.topicToolbarRight {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.adminSearchBox {
  display: flex;
  align-items: center;
  background: #1a1a22;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 0.35rem 0.8rem;
  gap: 0.5rem;
  width: 280px;
  transition: border-color 0.2s;
}

.adminSearchBox:focus-within {
  border-color: #3b82f6;
  background: #20202a;
}

.adminSearchInput {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.85rem;
  width: 100%;
  outline: none;
}

.clearSearchBtn {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px 4px;
}
.clearSearchBtn:hover {
  color: #fff;
}

/* 📊 VUETIFY CUSTOM ADMIN TABLE */
.adminTableCard {
  background: #141418;
  border: 1px solid #383848;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

:deep(.customAdminTable) {
  background: transparent !important;
  color: #e2e8f0 !important;
}

:deep(.customAdminTable .v-table__wrapper > table) {
  border-collapse: collapse !important;
  width: 100% !important;
}

:deep(.customAdminTable .v-table__wrapper > table > thead > tr > th) {
  background: #181822 !important;
  color: #94a3b8 !important;
  font-weight: 800 !important;
  font-size: 0.82rem !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 2px solid #475569 !important;
  padding: 14px 16px !important;
}

:deep(.customAdminTable .v-table__wrapper > table > tbody > tr > td) {
  border-bottom: 1px solid #383848 !important;
  font-size: 0.92rem !important;
  padding: 14px 16px !important;
  vertical-align: middle !important;
}

:deep(.customAdminTable .v-table__wrapper > table > tbody > tr) {
  border-bottom: 1px solid #383848 !important;
  transition: background 0.15s ease;
}

:deep(.customAdminTable .v-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content)) {
  background: rgba(59, 130, 246, 0.08) !important;
}

:deep(.customAdminTable .v-table__wrapper > table > tbody > tr:nth-child(even):not(.v-data-table__expanded__content)) {
  background: rgba(255, 255, 255, 0.02) !important;
}

:deep(.customAdminTable .v-data-table__expanded__content) {
  background: #0e0e12 !important;
}

:deep(.customAdminTable .v-data-table__expanded__content > td) {
  padding: 0 !important;
  border-bottom: 2px solid rgba(59, 130, 246, 0.4) !important;
}

:deep(.tableNoBadge) {
  display: inline-block;
  background: #26262e;
  color: #38bdf8;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

:deep(.tableTitleCell) {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

:deep(.tableFileCountBadge) {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: #24242c;
  color: #888;
}

:deep(.tableFileCountBadge.hasFiles) {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

:deep(.tableChipsRow) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

:deep(.miniFileChip) {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  white-space: nowrap;
}

:deep(.miniFileMore) {
  font-size: 0.7rem;
  color: #888;
  font-weight: 700;
}

:deep(.noFilesText) {
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

:deep(.tableActionsRow) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  white-space: nowrap;
  flex-wrap: nowrap;
}

:deep(.miniUploadBtn) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.35rem !important;
  white-space: nowrap !important;
  background: #1e3a8a !important;
  color: #93c5fd !important;
  border: 1px solid #3b82f6 !important;
  padding: 0.45rem 0.85rem !important;
  border-radius: 6px !important;
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  line-height: 1 !important;
  flex-shrink: 0 !important;
  transition: all 0.15s ease !important;
}

:deep(.miniUploadBtn:hover) {
  background: #2563eb !important;
  color: #fff !important;
}

:deep(.miniUploadBtn .btnPlus) {
  font-size: 0.95rem;
  line-height: 1;
  font-weight: 900;
}

:deep(.miniUploadBtn .btnText) {
  font-size: 0.8rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.02em;
}

/* 🔍 EXPANDED ROW STYLING */
:deep(.expandedDetailCell) {
  padding: 0 !important;
  background: #101013 !important;
}

:deep(.expandedTopicContainer) {
  padding: 1.5rem 2rem !important;
  border-top: 1px dashed rgba(59, 130, 246, 0.3) !important;
  border-bottom: 1px dashed rgba(59, 130, 246, 0.3) !important;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 16, 19, 0.8) 100%) !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.expandedTopicHeader) {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 1.2rem !important;
  gap: 1.5rem !important;
  flex-wrap: wrap !important;
}

:deep(.expandedEditRow) {
  display: flex !important;
  align-items: center !important;
  gap: 1.2rem !important;
  flex: 1 !important;
  min-width: 0 !important;
}

:deep(.expandedInputGroup) {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

:deep(.expandedInputGroup.titleGroup) {
  flex: 1 !important;
  min-width: 0 !important;
}

:deep(.inputLabel) {
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  color: #94a3b8 !important;
  white-space: nowrap !important;
}

:deep(.miniPicker) {
  padding: 0.45rem 0.9rem !important;
  font-size: 0.8rem !important;
}

:deep(.topicNoInput) {
  width: 55px !important;
  text-align: center !important;
  background: #26262e !important;
  color: #3b82f6 !important;
  font-weight: 800 !important;
  font-size: 0.95rem !important;
  border-radius: 6px !important;
  flex-shrink: 0 !important;
  border: 1px solid #3b82f6 !important;
  padding: 0.45rem 0.2rem !important;
}

:deep(.topicTitleInput) {
  flex: 1 !important;
  min-width: 0 !important;
  font-weight: 600 !important;
  font-size: 1.05rem !important;
  background: #181820 !important;
  border: 1px solid #2d2d3d !important;
  border-radius: 6px !important;
  padding: 0.45rem 0.8rem !important;
  color: #fff !important;
}

:deep(.topicTitleInput:focus) {
  border-color: #3b82f6 !important;
  outline: none !important;
}

:deep(.expandedFilesBox) {
  background: #141418 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 10px !important;
  padding: 1.2rem !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.deleteBtn,
:deep(.deleteBtn) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(239, 68, 68, 0.18) !important;
  color: #f87171 !important;
  border: 1px solid rgba(239, 68, 68, 0.38) !important;
  padding: 0.45rem 0.75rem !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-size: 0.9rem !important;
  line-height: 1 !important;
  transition: all 0.15s ease !important;
}

.deleteBtn:hover,
:deep(.deleteBtn:hover) {
  background: #dc2626 !important;
  color: #ffffff !important;
  border-color: #ef4444 !important;
}

.visualFilesGrid,
:deep(.visualFilesGrid) {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.8rem !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.fileChipCard,
:deep(.fileChipCard) {
  flex: 1 1 270px !important;
  min-width: 250px !important;
  max-width: 100% !important;
  background: #181822 !important;
  border: 1px solid #2d2d3d !important;
  border-radius: 8px !important;
  padding: 0.55rem 0.75rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.6rem !important;
  box-sizing: border-box !important;
  transition: all 0.15s ease !important;
}

.fileChipCard:hover,
:deep(.fileChipCard:hover) {
  background: #1f1f2c !important;
  border-color: #3b82f6 !important;
}

.fileTypeBadge,
:deep(.fileTypeBadge) {
  font-size: 0.65rem !important;
  font-weight: 800 !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 4px !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  line-height: 1.2 !important;
}

.badgeAna, :deep(.badgeAna) { background: #2563eb !important; color: #fff !important; }
.badgeHandout, :deep(.badgeHandout) { background: #059669 !important; color: #fff !important; }
.badgeSunum, :deep(.badgeSunum) { background: #d97706 !important; color: #fff !important; }
.badgeKahoot, :deep(.badgeKahoot) { background: #7c3aed !important; color: #fff !important; }
.badgeDefault, :deep(.badgeDefault) { background: #475569 !important; color: #fff !important; }

.fileChipTitleInput,
:deep(.fileChipTitleInput) {
  flex: 1 1 auto !important;
  min-width: 80px !important;
  width: 100% !important;
  background: transparent !important;
  border: 1px solid transparent !important;
  border-radius: 4px !important;
  padding: 0.25rem 0.4rem !important;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
  color: #f1f5f9 !important;
  text-overflow: ellipsis !important;
}

.fileChipTitleInput:focus,
:deep(.fileChipTitleInput:focus) {
  background: #0f0f15 !important;
  border-color: #3b82f6 !important;
  outline: none !important;
}

.fileChipActions,
:deep(.fileChipActions) {
  display: flex !important;
  align-items: center !important;
  gap: 0.35rem !important;
  flex-shrink: 0 !important;
  margin-left: auto !important;
}

.chipActionBtn,
:deep(.chipActionBtn) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-size: 0.85rem !important;
  line-height: 1 !important;
  transition: all 0.15s ease !important;
  text-decoration: none !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}

.chipActionBtn.preview,
:deep(.chipActionBtn.preview) {
  background: rgba(37, 99, 235, 0.18) !important;
  border: 1px solid rgba(59, 130, 246, 0.4) !important;
  color: #60a5fa !important;
}

.chipActionBtn.preview:hover,
:deep(.chipActionBtn.preview:hover) {
  background: #2563eb !important;
  border-color: #3b82f6 !important;
  color: #ffffff !important;
  transform: translateY(-1px) !important;
}

.chipActionBtn.delete,
:deep(.chipActionBtn.delete) {
  background: rgba(239, 68, 68, 0.18) !important;
  border: 1px solid rgba(239, 68, 68, 0.38) !important;
  color: #f87171 !important;
}

.chipActionBtn.delete:hover,
:deep(.chipActionBtn.delete:hover) {
  background: #dc2626 !important;
  border-color: #ef4444 !important;
  color: #ffffff !important;
  transform: translateY(-1px) !important;
}

.emptyFilesPlaceholder,
:deep(.emptyFilesPlaceholder) {
  color: #666 !important;
  font-size: 0.85rem !important;
  text-align: center !important;
  padding: 0.5rem !important;
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

/* CONFIRMATION / DELETE MODAL */
:deep(.confirmDeleteModal .v-overlay__content) {
  padding: 1rem !important;
}

.confirmCard {
  background: #15151e !important;
  border: 1px solid #2e2e3e !important;
  border-radius: 16px !important;
  padding: 1.5rem !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75) !important;
  overflow: hidden;
}

.confirmCardHeader {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.confirmIconWrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.confirmIcon {
  font-size: 1.5rem;
}

.confirmHeaderInfo {
  flex: 1;
}

.confirmTitle {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.35rem 0;
}

.confirmSubtitle {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
}

.confirmCardBody {
  padding: 0 0 1.2rem 0 !important;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.confirmTargetBox {
  background: #0d0d12;
  border: 1px solid #232330;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.confirmTargetLabel {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.confirmTargetName {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
  word-break: break-word;
}

.confirmSubtext {
  font-size: 0.85rem;
  color: #f59e0b;
  margin: 0;
  line-height: 1.4;
}

.confirmCardActions {
  padding: 0 !important;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.confirmBtn {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancelBtn {
  background: #242432;
  color: #94a3b8;
}

.cancelBtn:hover {
  background: #323244;
  color: #fff;
}

.dangerBtn {
  background: #dc2626;
  color: #fff;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
}

.dangerBtn:hover {
  background: #ef4444;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
}
</style>
