<template>
  <main id="top">
    <!-- 1. Header Banner & Sticky Nav -->
    <div class="topBanner">
      <a class="brand brandLogo" href="#top" aria-label="Young Professionals EU ana sayfa">
        <img src="/young-professionals-eu-header.png" alt="Young Professionals EU" />
      </a>
    </div>

    <header :class="['topbar', { 'is-scrolled': isScrolled }]">
      <div class="topbarActions">
        <a class="scrolledLogo" href="#top" aria-label="Young Professionals ana sayfa">
          <img src="/young-professionals-logo.png" alt="Young Professionals" />
        </a>
        <nav>
          <a href="#kaynaklar">Kaynaklar</a>
          <a href="#duyurular">Duyurular</a>
          <a href="#sorular">Sorular ve Teklifler</a>
          <a href="#hakkimizda">Hakkımızda</a>
          <NuxtLink to="/admin" class="adminNavBtn" title="Yönetici Paneli">⚙️ Admin</NuxtLink>
        </nav>
        <a class="outlineButton" href="#kaynaklar">
          Bölümleri keşfet <span>↓</span>
        </a>
      </div>
    </header>

    <!-- 2. Master Interactive Categories (3+2 Grid + Full-width Content Drawer) -->
    <section class="resources" id="kaynaklar">
      <div class="categoryGrid">
        <button
          v-for="c in categoriesList"
          :key="c.id"
          :class="['categoryCard', c.tone, { isActive: openCategory === c.id }]"
          :aria-expanded="openCategory === c.id"
          @click="toggleCategory(c.id)"
        >
          <div class="cardTop">
            <span>{{ c.no }}</span>
            <b>{{ c.icon }}</b>
          </div>
          <h3>{{ c.title }}</h3>
          <p>{{ c.text }}</p>
          <div class="cardLink">
            <span>{{ openCategory === c.id ? 'Kapat' : 'İçeriği aç' }}</span>
            <b>{{ openCategory === c.id ? '−' : '+' }}</b>
          </div>
        </button>
      </div>

      <!-- Active Expanded Panel below Grid -->
      <transition name="panel-slide">
        <div
          v-if="openCategory && activeCategoryData"
          :class="['activeResourcePanel', activeCategoryData.tone]"
          id="active-category-panel"
        >
          <div class="panelHeader">
            <div class="panelHeaderLeft">
              <span class="panelNumber">{{ activeCategoryData.no }}</span>
              <h3>{{ activeCategoryData.title }}</h3>
            </div>
            <button class="panelCloseBtn" @click="toggleCategory(openCategory)" aria-label="Bölümü kapat">
              <span>Kapat</span>
              <b>✕</b>
            </button>
          </div>

          <div class="insidePanel">
            <!-- 01 MÜFREDAT PANEL -->
            <template v-if="openCategory === 'curriculum'">
              <p class="stepLabel">1. Basamak · Kategori seçin</p>
              <div class="stepButtons">
                <button
                  v-for="step in curriculumSteps"
                  :key="step"
                  :class="[
                    step === 'ÖZEL GÜNLER' ? 'stepSpecial' : `step${step}`,
                    { active: openStep === step }
                  ]"
                  @click="selectStep(step)"
                >
                  <b>{{ step === 'ÖZEL GÜNLER' ? '✦' : step }}</b>
                  <span>{{ step === 'ÖZEL GÜNLER' ? 'Özel Günler' : `${step} Kategorisi` }}</span>
                  <i>→</i>
                </button>
              </div>

              <!-- 2. Basamak Topic Folders -->
              <div v-if="openStep" class="fileShelf curriculumShelf">
                <div>
                  <span>2. Basamak</span>
                  <h4>
                    {{ openStep === 'ÖZEL GÜNLER' ? 'Özel Günler Dosyaları' : `${openStep} Kategorisi Dosyaları` }}
                  </h4>
                  <p>
                    {{ currentTopics.length ? 'PDF dosyalarını görmek için konu başlığına tıklayın.' : 'Bu alana ilgili müfredat dosyaları yüklenecek.' }}
                  </p>
                </div>

                <div
                  v-if="currentTopics.length"
                  :class="['topicFolders', openStep === 'ÖZEL GÜNLER' ? 'topicSpecial' : `topic${openStep}`]"
                >
                  <div
                    v-for="topic in currentTopics"
                    :key="topic.no"
                    :class="['topicFolder', { topicOpen: openTopic === topic.no }]"
                  >
                    <button
                      class="topicHead"
                      :aria-expanded="openTopic === topic.no"
                      @click="toggleTopic(topic.no)"
                    >
                      <span class="topicNo">{{ topic.no }}</span>
                      <b>{{ topic.title }}</b>
                      <i>{{ openTopic === topic.no ? '−' : '+' }}</i>
                    </button>

                    <div v-if="openTopic === topic.no">
                      <div v-if="topic.files && topic.files.length" class="pdfList">
                        <div
                          v-for="file in topic.files"
                          :key="file.href"
                          class="pdfListItem"
                          @click="openPdf(file)"
                        >
                          <span class="pdfBadge">PDF</span>
                          <b>{{ file.title }}</b>
                          <v-btn
                            icon="mdi-eye-outline"
                            variant="text"
                            size="x-small"
                            color="primary"
                            title="Önizle"
                            @click.stop="openPdf(file)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-download"
                            variant="text"
                            size="x-small"
                            color="grey-darken-1"
                            :href="file.href"
                            target="_blank"
                            title="İndir"
                            @click.stop
                          ></v-btn>
                        </div>
                      </div>
                      <div v-else class="filePlaceholder">
                        <b>＋</b>
                        <span>Dosyalar eklenecek</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="filePlaceholder">
                  <b>＋</b>
                  <span>Dosya eklenecek</span>
                </div>
              </div>
            </template>

            <!-- 02 KÜTÜPHANE / READING PLAN PANEL -->
            <template v-else-if="openCategory === 'books'">
              <div class="libraryPanel">
                <button
                  class="readingPlanHead"
                  :aria-expanded="openReadingPlan"
                  @click="openReadingPlan = !openReadingPlan"
                >
                  <div>
                    <span>2026–27</span>
                    <h4>Okuma Planı</h4>
                    <p>Kitap kapaklarını ve bağlantılarını görüntüleyin.</p>
                  </div>
                  <b>{{ openReadingPlan ? '−' : '+' }}</b>
                </button>

                <div v-if="openReadingPlan" class="bookGrid">
                  <a
                    v-for="book in booksList"
                    :key="book.title"
                    :href="book.href"
                    target="_blank"
                    rel="noreferrer"
                    class="bookCard"
                  >
                    <div class="bookCover">
                      <img :src="book.cover" :alt="`${book.title} kitap kapağı`" />
                      <span>Kitabı incele ↗</span>
                    </div>
                    <div class="bookInfo">
                      <b>{{ book.title }}</b>
                      <p>{{ book.author }}</p>
                    </div>
                  </a>
                </div>
              </div>
            </template>

            <!-- 03 AKTİVİTELER / PLATFORMLAR PANEL -->
            <template v-else-if="openCategory === 'activities'">
              <div class="activityPlatforms">
                <div class="platformIntro">
                  <span>{{ platformsList.length }} ALT PLATFORM</span>
                  <h4>Gençlerin gelişim ve paylaşım alanları</h4>
                  <p>Platform başlığına tıklayarak ilgili alanı açabilirsiniz.</p>
                </div>
                <div class="platformList">
                  <div
                    v-for="(platform, index) in platformsList"
                    :key="platform"
                    :class="['platformItem', { platformOpen: openActivityPlatform === platform }]"
                  >
                    <button
                      :aria-expanded="openActivityPlatform === platform"
                      @click="toggleActivityPlatform(platform)"
                    >
                      <b>{{ String(index + 1).padStart(2, '0') }}</b>
                      <span>{{ platform }}</span>
                      <i>{{ openActivityPlatform === platform ? '−' : '+' }}</i>
                    </button>

                    <div v-if="openActivityPlatform === platform" class="platformContent">
                      <template v-if="platformDetails[platform]">
                        <a
                          class="familySeminarCard"
                          :href="platformDetails[platform].linkHref || '#'"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            v-if="platformDetails[platform].bannerImage"
                            :src="platformDetails[platform].bannerImage"
                            :alt="platformDetails[platform].bannerAlt || platform"
                          />
                          <span>{{ platformDetails[platform].linkText || 'Bilgileri görüntüle ↗' }}</span>
                        </a>
                      </template>

                      <template v-else>
                        <p>Bu platforma ait çalışmalar, etkinlikler ve dosyalar burada yayınlanacak.</p>
                        <span>İçerikler hazırlanıyor</span>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 04 GEZİ GÜZERGAHLARI PANEL -->
            <template v-else-if="openCategory === 'routes'">
              <div class="citiesPanel">
                <!-- Hamburg City Guide -->
                <button
                  class="cityCoverCard"
                  :aria-expanded="openCity === 'hamburg'"
                  @click="toggleCity('hamburg')"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/HamburgSpeicherstadt.jpg/1280px-HamburgSpeicherstadt.jpg"
                    alt="Hamburg Speicherstadt gece manzarası"
                  />
                  <span class="cityShade"></span>
                  <div>
                    <span>ALMANYA · ŞEHİR REHBERİ</span>
                    <h4>Hamburg</h4>
                    <p>Liman, tarih, kültür ve lezzet durakları</p>
                  </div>
                  <b>{{ openCity === 'hamburg' ? 'Rehberi kapat −' : 'Güzergâhı aç →' }}</b>
                </button>

                <div v-if="openCity === 'hamburg'" class="cityGuide">
                  <div class="cityGuideIntro">
                    <div>
                      <span>HAMBURG · GEZİ PLANI</span>
                      <h4>Şehri adım adım keşfet</h4>
                      <p>Duraklar şehir merkezinden liman ve HafenCity yönüne doğru düzenlendi.</p>
                    </div>
                    <a href="https://www.google.com/maps/search/?api=1&query=Hamburg" target="_blank" rel="noreferrer">
                      Hamburg haritası ↗
                    </a>
                  </div>

                  <!-- 01 Places -->
                  <section class="guideBlock routeBlock">
                    <div class="guideNumber">01</div>
                    <div>
                      <button
                        class="guideSectionToggle"
                        :aria-expanded="openGuideSection === 'hamburg-places'"
                        @click="toggleGuideSection('hamburg-places')"
                      >
                        <span>Gezilecek yerler</span>
                        <b>{{ openGuideSection === 'hamburg-places' ? '−' : '+' }}</b>
                      </button>
                      <p v-if="openGuideSection === 'hamburg-places'" class="guideHint">
                        Her durağa dokunarak Google Haritalar’da açabilirsiniz.
                      </p>
                      <div v-if="openGuideSection === 'hamburg-places'" class="routeTimeline">
                        <a
                          v-for="(stop, index) in cityGuidesData.hamburgStops"
                          :key="stop.name"
                          :href="stop.href"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{{ String(index + 1).padStart(2, '0') }}</span>
                          <div>
                            <b>{{ stop.name }}</b>
                            <small v-if="stop.note">{{ stop.note }}</small>
                          </div>
                          <i>↗</i>
                        </a>
                      </div>
                    </div>
                  </section>

                  <!-- 02 & 03 Columns -->
                  <div class="guideColumns">
                    <section class="guideBlock">
                      <div class="guideNumber">02</div>
                      <div>
                        <button
                          class="guideSectionToggle"
                          :aria-expanded="openGuideSection === 'hamburg-food'"
                          @click="toggleGuideSection('hamburg-food')"
                        >
                          <span>Yemek yerleri</span>
                          <b>{{ openGuideSection === 'hamburg-food' ? '−' : '+' }}</b>
                        </button>
                        <div v-if="openGuideSection === 'hamburg-food'" class="guideLinkList">
                          <a
                            v-for="place in cityGuidesData.hamburgFood"
                            :key="place"
                            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Hamburg`)}`"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{{ place }}</span>
                            <i>↗</i>
                          </a>
                        </div>
                      </div>
                    </section>

                    <section class="guideBlock">
                      <div class="guideNumber">03</div>
                      <div>
                        <button
                          class="guideSectionToggle"
                          :aria-expanded="openGuideSection === 'hamburg-prayer'"
                          @click="toggleGuideSection('hamburg-prayer')"
                        >
                          <span>Namaz kılma imkânları</span>
                          <b>{{ openGuideSection === 'hamburg-prayer' ? '−' : '+' }}</b>
                        </button>
                        <div v-if="openGuideSection === 'hamburg-prayer'" class="guideLinkList">
                          <a
                            v-for="place in cityGuidesData.hamburgMosques"
                            :key="place.name"
                            :href="place.href"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{{ place.name }}</span>
                            <i>↗</i>
                          </a>
                        </div>
                      </div>
                    </section>
                  </div>

                  <!-- 04 Institutions -->
                  <section class="guideBlock institutionsBlock">
                    <div class="guideNumber">04</div>
                    <div>
                      <button
                        class="guideSectionToggle"
                        :aria-expanded="openGuideSection === 'hamburg-institutions'"
                        @click="toggleGuideSection('hamburg-institutions')"
                      >
                        <span>Kurumlar</span>
                        <b>{{ openGuideSection === 'hamburg-institutions' ? '−' : '+' }}</b>
                      </button>
                      <div v-if="openGuideSection === 'hamburg-institutions'" class="institutionTags">
                        <span v-for="name in cityGuidesData.hamburgInstitutions" :key="name">{{ name }}</span>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Frankfurt City Guide -->
                <button
                  class="cityCoverCard"
                  :aria-expanded="openCity === 'frankfurt'"
                  @click="toggleCity('frankfurt')"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Frankfurt_am_Main_2011_Skyline_origres.jpg"
                    alt="Frankfurt silüeti ve Main Nehri gece manzarası"
                  />
                  <span class="cityShade"></span>
                  <div>
                    <span>ALMANYA · ŞEHİR REHBERİ</span>
                    <h4>Frankfurt</h4>
                    <p>Main Nehri, kültür, etkinlik ve lezzet durakları</p>
                  </div>
                  <b>{{ openCity === 'frankfurt' ? 'Rehberi kapat −' : 'Güzergâhı aç →' }}</b>
                </button>

                <div v-if="openCity === 'frankfurt'" class="cityGuide">
                  <div class="cityGuideIntro">
                    <div>
                      <span>FRANKFURT · GEZİ PLANI</span>
                      <h4>Frankfurt’u adım adım keşfet</h4>
                      <p>Main Nehri çevresindeki gezi, yemek, kurum ve namaz imkânları düzenlendi.</p>
                    </div>
                    <a href="https://www.google.com/maps/search/?api=1&query=Frankfurt" target="_blank" rel="noreferrer">
                      Frankfurt haritası ↗
                    </a>
                  </div>

                  <!-- 01 Places -->
                  <section class="guideBlock routeBlock">
                    <div class="guideNumber">01</div>
                    <div>
                      <button
                        class="guideSectionToggle"
                        :aria-expanded="openGuideSection === 'frankfurt-places'"
                        @click="toggleGuideSection('frankfurt-places')"
                      >
                        <span>Gezilecek yerler</span>
                        <b>{{ openGuideSection === 'frankfurt-places' ? '−' : '+' }}</b>
                      </button>
                      <p v-if="openGuideSection === 'frankfurt-places'" class="guideHint">
                        Her durağa dokunarak harita veya etkinlik bilgilerini açabilirsiniz.
                      </p>
                      <div v-if="openGuideSection === 'frankfurt-places'" class="routeTimeline">
                        <a
                          v-for="(stop, index) in cityGuidesData.frankfurtStops"
                          :key="stop.name"
                          :href="stop.href || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query || stop.name)}`"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{{ String(index + 1).padStart(2, '0') }}</span>
                          <div>
                            <b>{{ stop.name }}</b>
                            <small v-if="stop.note">{{ stop.note }}</small>
                          </div>
                          <i>↗</i>
                        </a>
                      </div>
                    </div>
                  </section>

                  <!-- 02 & 03 Columns -->
                  <div class="guideColumns">
                    <section class="guideBlock">
                      <div class="guideNumber">02</div>
                      <div>
                        <button
                          class="guideSectionToggle"
                          :aria-expanded="openGuideSection === 'frankfurt-food'"
                          @click="toggleGuideSection('frankfurt-food')"
                        >
                          <span>Yemek yerleri</span>
                          <b>{{ openGuideSection === 'frankfurt-food' ? '−' : '+' }}</b>
                        </button>
                        <div v-if="openGuideSection === 'frankfurt-food'" class="guideLinkList">
                          <a
                            v-for="place in cityGuidesData.frankfurtFood"
                            :key="place"
                            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Frankfurt`)}`"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{{ place }}</span>
                            <i>↗</i>
                          </a>
                        </div>
                      </div>
                    </section>

                    <section class="guideBlock">
                      <div class="guideNumber">03</div>
                      <div>
                        <button
                          class="guideSectionToggle"
                          :aria-expanded="openGuideSection === 'frankfurt-prayer'"
                          @click="toggleGuideSection('frankfurt-prayer')"
                        >
                          <span>Namaz kılma imkânları</span>
                          <b>{{ openGuideSection === 'frankfurt-prayer' ? '−' : '+' }}</b>
                        </button>
                        <div v-if="openGuideSection === 'frankfurt-prayer'" class="guideLinkList">
                          <a
                            v-for="place in cityGuidesData.frankfurtPrayer"
                            :key="place"
                            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Frankfurt`)}`"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{{ place }}</span>
                            <i>↗</i>
                          </a>
                        </div>
                      </div>
                    </section>
                  </div>

                  <!-- 04 Institutions -->
                  <section class="guideBlock institutionsBlock">
                    <div class="guideNumber">04</div>
                    <div>
                      <button
                        class="guideSectionToggle"
                        :aria-expanded="openGuideSection === 'frankfurt-institutions'"
                        @click="toggleGuideSection('frankfurt-institutions')"
                      >
                        <span>Kurumlar</span>
                        <b>{{ openGuideSection === 'frankfurt-institutions' ? '−' : '+' }}</b>
                      </button>
                      <div v-if="openGuideSection === 'frankfurt-institutions'" class="institutionTags">
                        <span v-for="name in cityGuidesData.frankfurtInstitutions" :key="name">{{ name }}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </template>

            <!-- 05 DUYURULAR PANEL -->
            <template v-else-if="openCategory === 'news'">
              <div class="fileShelf simpleShelf">
                <div>
                  <span>İçerik alanı</span>
                  <h4>Duyurular</h4>
                  <p>Yeni dönem buluşmaları ve güncel duyurular aşağıda listelenmektedir.</p>
                </div>
                <div class="filePlaceholder">
                  <b>✦</b>
                  <span>Tüm güncel duyurular ana sayfada aktiftir</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </section>

    <!-- 3. Announcement Banner (Dynamic from CMS) -->
    <section class="announcement" id="duyurular">
      <div>
        <p class="eyebrow">
          <span></span> {{ announcementData.eyebrow }}
        </p>
        <h2>{{ announcementData.title }}</h2>
        <p>{{ announcementData.description }}</p>
      </div>
      <div class="datesContainer">
        <div
          v-for="meeting in announcementData.meetings"
          :key="meeting.title"
          class="date"
        >
          <small style="display:block; font-size: 0.75rem; opacity: 0.8; margin-bottom: 2px;">{{ meeting.title }}</small>
          <b>{{ meeting.dateRange }}</b>
          <span>{{ meeting.monthYear }}</span>
        </div>
      </div>
      <a :href="announcementData.buttonHref">{{ announcementData.buttonText }}</a>
    </section>

    <!-- 4. Contact Form Section -->
    <section class="contactSection" id="sorular">
      <div class="contactIntro">
        <p class="eyebrow">
          <span></span> İletişim
        </p>
        <h2>
          Sorular ve<br />
          <em>Teklifler</em>
        </h2>
        <p>
          Görüşlerinizi, sorularınızı ve proje tekliflerinizi bizimle paylaşabilirsiniz.
          Mesajınız doğrudan Young Professionals yöneticisine gönderilir.
        </p>
        <a href="mailto:info@young-professionals.eu">info@young-professionals.eu</a>
      </div>
      <form
        class="contactForm"
        action="mailto:info@young-professionals.eu"
        method="post"
        enctype="text/plain"
        @submit.prevent="submitContactForm"
      >
        <label>
          Adınız ve soyadınız
          <input v-model="contactForm.name" name="Ad Soyad" type="text" required placeholder="Adınızı yazın" />
        </label>
        <label>
          E-posta adresiniz
          <input v-model="contactForm.email" name="E-posta" type="email" required placeholder="ornek@email.com" />
        </label>
        <label>
          Mesaj türü
          <select v-model="contactForm.type" name="Mesaj Türü">
            <option value="Soru">Soru</option>
            <option value="Teklif">Teklif</option>
            <option value="Görüş ve öneri">Görüş ve öneri</option>
          </select>
        </label>
        <label>
          Mesajınız
          <textarea v-model="contactForm.message" name="Mesaj" required :rows="6" placeholder="Mesajınızı buraya yazın..."></textarea>
        </label>
        <button type="submit">
          Yöneticiye gönder <span>↗</span>
        </button>
        <small>
          Gönder düğmesi cihazınızdaki e-posta uygulamasını açar. Mesajınız doğrudan yönetici adresine gider.
        </small>
      </form>
    </section>

    <!-- 5. Manifesto Section -->
    <section class="manifesto" id="hakkimizda">
      <p>YOUNG PROFESSIONALS</p>
      <h2>
        İnanmış Bir Gençlik,<br />
        <em>Ümit Dolu Bir Gelecek</em>
      </h2>
      <div class="legalNotice">
        <h3>Hakkımızda ve içerik kullanımı</h3>
        <p>
          Young Professionals, gençlerin eğitimine ve gelişimine katkı sunmayı amaçlayan,
          ticari olmayan bir bilgi ve paylaşım platformudur. Sitedeki içerikler genel bilgilendirme
          amacı taşır; hukuki veya profesyonel danışmanlık yerine geçmez.
        </p>
        <p>
          Özgün metinlerin, tasarımların ve dosyaların izinsiz çoğaltılması, değiştirilmesi,
          yayımlanması veya ticari amaçla kullanılması yasaktır. Kaynak gösterilen içeriklerin hakları
          ilgili hak sahiplerine aittir. Haricî bağlantıların içeriğinden ilgili site sağlayıcıları sorumludur.
        </p>
        <p>
          Hak ihlali, düzeltme veya kaldırma talepleri için:
          <a href="mailto:info@young-professionals.eu">info@young-professionals.eu</a>
        </p>
      </div>
    </section>

    <!-- 6. Footer -->
    <footer>
      <a class="brand brandLogo footerLogo" href="#top" aria-label="Young Professionals ana sayfa">
        <img src="/young-professionals-logo.png" alt="Young Professionals" />
      </a>
      <p>Gençler için, gençlerle birlikte.</p>
      <span>© 2026</span>
    </footer>

    <!-- Global Persistent Audio Player Bar -->
    <AudioPlayerBar
      :current-track="activeTrack"
      @close="activeTrack = null"
      @open-pdf="openPdf"
    />

    <!-- PDF Preview Modal -->
    <PdfViewerModal
      v-model="previewModalOpen"
      :file="selectedPreviewFile"
      @play-audio="playAudio"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { SohbetFile } from '~/server/api/sohbets/index.get'
import type { SiteContent } from '~/types'
import { getInitialSiteContent } from '~/data/initial-content'
import { curriculumSteps } from '~/data/curriculum'

useSeoMeta({
  title: 'Young Professionals EU · Gençlik Bilgi ve Tecrübe Paylaşım Platformu',
  description: 'Gençlik Bilgi ve Tecrübe Paylaşım Platformu',
  ogTitle: 'Young Professionals EU',
  ogDescription: 'Gençlik Bilgi ve Tecrübe Paylaşım Platformu',
  ogImage: 'https://young-professionals.eu/og.png',
  ogUrl: 'https://young-professionals.eu',
  ogSiteName: 'Young Professionals EU',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Young Professionals EU',
  twitterDescription: 'Gençlik Bilgi ve Tecrübe Paylaşım Platformu',
  twitterImage: 'https://young-professionals.eu/og.png'
})

// Dynamic Content fetch from R2 with local fallback
const { data: remoteContent } = await useFetch<SiteContent>('/api/content')
const fallbackContent = getInitialSiteContent()

const content = computed<SiteContent>(() => remoteContent.value || fallbackContent)

const categoriesList = computed(() => content.value.categories || fallbackContent.categories)
const curriculumTopicsData = computed(() => content.value.curriculumTopics || fallbackContent.curriculumTopics)
const booksList = computed(() => content.value.readingPlanBooks || fallbackContent.readingPlanBooks)
const platformsList = computed(() => content.value.activityPlatforms || fallbackContent.activityPlatforms)
const platformDetails = computed(() => content.value.activityPlatformDetails || fallbackContent.activityPlatformDetails)
const cityGuidesData = computed(() => content.value.cityGuides || fallbackContent.cityGuides)
const announcementData = computed(() => content.value.announcement || fallbackContent.announcement)

// Scroll State for Dynamic Header
const isScrolled = ref(false)
let ticking = false

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const top = window.scrollY || document.documentElement.scrollTop || 0
      if (!isScrolled.value && top > 70) {
        isScrolled.value = true
      } else if (isScrolled.value && top < 20) {
        isScrolled.value = false
      }
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// State for Accordion & Interactivity
const openCategory = ref<string | null>(null)
const activeCategoryData = computed(() => categoriesList.value.find(c => c.id === openCategory.value))
const openStep = ref<string | null>(null)
const openTopic = ref<string | null>(null)
const openReadingPlan = ref(true)
const openCity = ref<string | null>(null)
const openGuideSection = ref<string | null>('hamburg-places')
const openActivityPlatform = ref<string | null>('Genç Aile')

const currentTopics = computed(() => {
  if (!openStep.value) return []
  return (curriculumTopicsData.value as any)[openStep.value] || []
})

const previewModalOpen = ref(false)
const selectedPreviewFile = ref<SohbetFile | null>(null)
const activeTrack = ref<SohbetFile | null>(null)

// Contact Form State
const contactForm = ref({
  name: '',
  email: '',
  type: 'Soru',
  message: ''
})

function submitContactForm() {
  const name = contactForm.value.name.trim()
  const email = contactForm.value.email.trim()
  const type = contactForm.value.type || 'Soru'
  const message = contactForm.value.message.trim()

  const subject = encodeURIComponent(`[Young Professionals] ${type} - ${name}`)
  const body = encodeURIComponent(
    `Ad Soyad: ${name}\nE-posta: ${email}\nMesaj Türü: ${type}\n\nMesaj:\n${message}\n`
  )
  window.location.href = `mailto:info@young-professionals.eu?subject=${subject}&body=${body}`
}

function toggleCategory(id: string) {
  if (openCategory.value === id) {
    openCategory.value = null
  } else {
    openCategory.value = id
    nextTick(() => {
      const el = document.getElementById('active-category-panel')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }
}

function selectStep(step: string) {
  openStep.value = openStep.value === step ? null : step
  openTopic.value = null
}

function toggleTopic(no: string) {
  openTopic.value = openTopic.value === no ? null : no
}

function toggleCity(city: string) {
  openCity.value = openCity.value === city ? null : city
  openGuideSection.value = city === 'hamburg' ? 'hamburg-places' : 'frankfurt-places'
}

function toggleGuideSection(section: string) {
  openGuideSection.value = openGuideSection.value === section ? null : section
}

function toggleActivityPlatform(platform: string) {
  openActivityPlatform.value = openActivityPlatform.value === platform ? null : platform
}

function openPdf(file: any) {
  let fileKey = file.key || ''
  if (!fileKey && file.href) {
    if (file.href.includes('key=')) {
      const match = file.href.match(/key=([^&]+)/)
      if (match) fileKey = decodeURIComponent(match[1])
    } else {
      fileKey = file.href.replace(/^\//, '')
    }
  }

  const streamUrl = `/api/sohbets/stream?key=${encodeURIComponent(fileKey)}`
  const downloadUrl = `/api/sohbets/stream?download=true&key=${encodeURIComponent(fileKey)}`

  selectedPreviewFile.value = {
    key: fileKey,
    name: file.title || file.name,
    folderPath: '',
    size: 0,
    lastModified: '',
    downloadUrl: file.downloadUrl || downloadUrl,
    previewUrl: file.href || streamUrl,
    fileType: 'pdf',
    hasPdf: true,
    hasAudio: false
  }
  previewModalOpen.value = true
}

function playAudio(file: any) {
  activeTrack.value = file
}
</script>
