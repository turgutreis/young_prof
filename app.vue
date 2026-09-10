<template>
  <v-app>
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
            v-for="c in categories"
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
                        class="folderHead"
                        :aria-expanded="openTopic === topic.no"
                        @click="toggleTopic(topic.no)"
                      >
                        <b>{{ topic.no }}</b>
                        <div>
                          <span>KONU DOSYASI</span>
                          <h5>{{ topic.title }}</h5>
                        </div>
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
                      v-for="book in readingPlanBooks"
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
                      <h5>{{ book.title }}</h5>
                      <p>{{ book.author }}</p>
                    </a>
                  </div>
                </div>
              </template>

              <!-- 03 AKTİVİTELER / PLATFORMLAR PANEL -->
              <template v-else-if="openCategory === 'activities'">
                <div class="activityPlatforms">
                  <div class="platformIntro">
                    <span>5 ALT PLATFORM</span>
                    <h4>Gençlerin gelişim ve paylaşım alanları</h4>
                    <p>Platform başlığına tıklayarak ilgili alanı açabilirsiniz.</p>
                  </div>
                  <div class="platformList">
                    <div
                      v-for="(platform, index) in activityPlatforms"
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
                        <template v-if="platform === 'Genç Aile'">
                          <a
                            class="familySeminarCard"
                            href="https://erdemlileryolu.de/kurslar/huzurlu-bir-yuva-icin-aile-seminerleri-online/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Evliliğe Hazırlık Eğitimi kayıt sayfasını aç"
                          >
                            <img
                              src="/genc-aile-evlilige-hazirlik-egitimi.png"
                              alt="Erdemliler Yolu Akademisi Evliliğe Hazırlık Eğitimi afişi"
                            />
                            <span>Seminer bilgileri ve kayıt ↗</span>
                          </a>
                        </template>

                        <template v-else-if="platform === 'Genç İş İnsanları Platformu'">
                          <a
                            class="familySeminarCard"
                            href="https://www.buv-ev.de/jung-selbststandig-2/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Jung und Selbstständig etkinlik sayfasını aç"
                          >
                            <img
                              src="/genc-is-insanlari-jung-selbststandig.png"
                              alt="Jung und Selbstständig etkinlik afişi"
                            />
                            <span>Etkinlik bilgilerini görüntüle ↗</span>
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
                            v-for="(stop, index) in hamburgStops"
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
                              v-for="place in hamburgFood"
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
                              v-for="place in hamburgMosques"
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
                          <span v-for="name in hamburgInstitutions" :key="name">{{ name }}</span>
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
                        <div v-if="openGuideSection === 'frankfurt-places'" class="routeTimeline">
                          <a
                            v-for="(stop, index) in frankfurtStops"
                            :key="stop.name"
                            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query)}`"
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
                              v-for="place in frankfurtFood"
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
                              v-for="place in frankfurtPrayer"
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
                          <span v-for="name in frankfurtInstitutions" :key="name">{{ name }}</span>
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
                    <p>Bu bölüme ilgili dosyalar ve içerikler eklenecek.</p>
                  </div>
                  <div class="filePlaceholder">
                    <b>＋</b>
                    <span>Dosya eklenecek</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </transition>
      </section>

      <!-- 3. Announcement Banner -->
      <section class="announcement" id="duyurular">
        <div>
          <p class="eyebrow">
            <span></span> Son duyuru
          </p>
          <h2>Yeni dönem buluşması</h2>
          <p>
            Yeni dönem planını birlikte şekillendirmek için fikirlerinle aramıza katıl.
          </p>
        </div>
        <div class="date">
          <b>12–13</b>
          <span>EYLÜL<br />2026</span>
        </div>
        <a href="mailto:info@young-professionals.eu">Bilgi al ↗</a>
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
        >
          <label>
            Adınız ve soyadınız
            <input name="Ad Soyad" type="text" required placeholder="Adınızı yazın" />
          </label>
          <label>
            E-posta adresiniz
            <input name="E-posta" type="email" required placeholder="ornek@email.com" />
          </label>
          <label>
            Mesaj türü
            <select name="Mesaj Türü" default-value="Soru">
              <option>Soru</option>
              <option>Teklif</option>
              <option>Görüş ve öneri</option>
            </select>
          </label>
          <label>
            Mesajınız
            <textarea name="Mesaj" required :rows="6" placeholder="Mesajınızı buraya yazın..."></textarea>
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
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { SohbetFile } from '~/server/api/sohbets/index.get'

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

// Scroll State for Dynamic Header
const isScrolled = ref(false)
let ticking = false

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const top = window.scrollY || document.documentElement.scrollTop || 0
      // Hysteresis deadband prevents flickering/jittering at threshold
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
const activeCategoryData = computed(() => categories.find(c => c.id === openCategory.value))
const openStep = ref<string | null>(null)
const openTopic = ref<string | null>(null)
const openReadingPlan = ref(true)
const openCity = ref<string | null>(null)
const openGuideSection = ref<string | null>('hamburg-places')
const openActivityPlatform = ref<string | null>('Genç Aile')

const previewModalOpen = ref(false)
const selectedPreviewFile = ref<SohbetFile | null>(null)
const activeTrack = ref<SohbetFile | null>(null)

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
  selectedPreviewFile.value = {
    key: file.href || file.key,
    name: file.title || file.name,
    folderPath: '',
    size: 0,
    lastModified: '',
    downloadUrl: file.href || file.downloadUrl,
    previewUrl: file.href || file.previewUrl,
    fileType: 'pdf',
    hasPdf: true,
    hasAudio: false
  }
  previewModalOpen.value = true
}

function playAudio(file: any) {
  activeTrack.value = file
}

// Master Data definition matching legacy_code exactly
const categories = [
  {
    id: 'curriculum',
    no: '01',
    title: 'Müfredat',
    text: 'Adım adım gelişim programları ve dönem planları',
    tone: 'curriculumBlue',
    icon: '✦'
  },
  {
    id: 'books',
    no: '02',
    title: 'Kütüphane',
    text: 'Kitap tavsiyeleri, seçilmiş okumalar ve özetler',
    tone: 'lime',
    icon: '⌁'
  },
  {
    id: 'activities',
    no: '03',
    title: 'Aktiviteler / Ünite Çalışmaları',
    text: 'Grup çalışmaları, atölyeler ve uygulanabilir etkinlikler',
    tone: 'violet',
    icon: '◎'
  },
  {
    id: 'routes',
    no: '04',
    title: 'Gezi Güzergâhları',
    text: 'Kültür, tarih ve doğayı keşfetmek için hazır rotalar',
    tone: 'routesGreen',
    icon: '↗'
  },
  {
    id: 'news',
    no: '05',
    title: 'Duyurular',
    text: 'Yeni programlar, buluşmalar ve önemli tarihler',
    tone: 'yellow',
    icon: '!'
  }
]

const curriculumSteps = ['A', 'B', 'C', 'ÖZEL GÜNLER']

const activityPlatforms = [
  'Gençlik Açılım ve Diyalog Platformu',
  'Gençlik Okuma Kulübü',
  'Genç İş İnsanları Platformu',
  'Genç Aile',
  'Genç Spor-Aktivite Platformu'
]

const readingPlanBooks = [
  {
    title: "Kur’an’ın Sihirli Ufku: Fatiha ve Bakara Suresi (1–39)",
    author: 'M. Fethullah Gülen',
    cover: '/books/2026-27/fatiha-bakara.png',
    href: 'https://kitapdunyasi.eu/products/kuranin-sihirli-ufku-fatiha-ve-bakara-suresi-1-39'
  },
  {
    title: 'Adanmış Bir Gönül İnsanı: Hacı Ata',
    author: 'Muhittin Küçük',
    cover: '/books/2026-27/haci-ata.png',
    href: 'https://kitapdunyasi.eu/products/adanmis-bir-gonul-i̇nsani-haci-ata'
  },
  {
    title: 'Das Hauptgebet – Mein Augenlicht',
    author: 'Şerif Özcan',
    cover: '/books/2026-27/das-hauptgebet.png',
    href: 'https://kitapdunyasi.eu/collections/yeni-cikanlar/products/das-hauptgebet-mein-augenlicht'
  },
  {
    title: 'Gençlik Rehberi Üzerine',
    author: 'Bediüzzaman Said Nursî · Açıklamalar: Abdullah Aymaz',
    cover: '/books/2026-27/genclik-rehberi.png',
    href: 'https://kitapdunyasi.eu/products/genclik-rehberi-uzerine-sureyya?_pos=2&_sid=c1694656b&_ss=r'
  },
  {
    title: 'İnsan Neyle Yaşar?',
    author: 'L. N. Tolstoy',
    cover: '/books/2026-27/insan-neyle-yasar.png',
    href: 'https://kitapdunyasi.eu/products/i̇nsan-neyle-yasar-karton-kapak?_pos=2&_sid=18edda30d&_ss=r'
  },
  {
    title: 'Yayınlanmayan Lâhika Mektuplarından Seçmeler',
    author: 'Bediüzzaman Said Nursî',
    cover: '/books/2026-27/yayinlanmayan-lahika-mektuplari.png',
    href: 'https://kitapdunyasi.eu/products/yayinlanmayan-lahika-mektuplari?_pos=1&_sid=c97367bb2&_ss=r'
  },
  {
    title: '40 Hadithe – Essenzielle Lehren des Propheten Muhammed',
    author: 'Mit Kommentar von Esat Mavinehir',
    cover: '/books/2026-27/40-hadithe.png',
    href: 'https://kitapdunyasi.eu/products/40-hadithe-essenzielle-lehren-des-propheten-muhammed?_pos=1&_sid=2c744cd93&_ss=r'
  }
]

// Step A, B, C, Özel Günler Files
const sohbetiCananFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/01-sohbet-i-canan/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/01-sohbet-i-canan/handout.pdf' },
  { title: 'Sunum', href: '/files/01-sohbet-i-canan/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/01-sohbet-i-canan/kahoot.pdf' }
]
const allahaImanFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/03-allaha-iman/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/03-allaha-iman/handout.pdf' },
  { title: 'Sunum', href: '/files/03-allaha-iman/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/03-allaha-iman/kahoot.pdf' }
]
const peygamberlereImanFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/06-peygamberlere-iman/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/06-peygamberlere-iman/handout.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/06-peygamberlere-iman/kahoot.pdf' },
  { title: 'Sunum', href: '/files/06-peygamberlere-iman/sunum.pdf' }
]
const namazFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/19-namaz/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/19-namaz/handout.pdf' },
  { title: 'Sunum', href: '/files/19-namaz/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/19-namaz/kahoot.pdf' }
]
const isYogunluguNamazHirsizligiFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/20-is-yogunlugu-namaz-hirsizligi/ana-calisma-metni.pdf' },
  { title: 'Özet', href: '/files/20-is-yogunlugu-namaz-hirsizligi/ozet.pdf' },
  { title: 'Sunum', href: '/files/20-is-yogunlugu-namaz-hirsizligi/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/20-is-yogunlugu-namaz-hirsizligi/kahoot.pdf' }
]
const nubuvveteDelillerFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/11-nubuvvete-deliller/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/11-nubuvvete-deliller/handout.pdf' },
  { title: 'Sunum', href: '/files/11-nubuvvete-deliller/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/11-nubuvvete-deliller/kahoot.pdf' }
]
const semailAhlakAdabFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/13-semail-ahlak-adab/ana-calisma-metni.pdf' },
  { title: 'Handout 1', href: '/files/13-semail-ahlak-adab/handout-1.pdf' },
  { title: 'Handout 2', href: '/files/13-semail-ahlak-adab/handout-2.pdf' },
  { title: 'Sunum', href: '/files/13-semail-ahlak-adab/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/13-semail-ahlak-adab/kahoot.pdf' }
]
const sahabeFaziletleriFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/15-sahabe-efendilerimizin-faziletleri/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/15-sahabe-efendilerimizin-faziletleri/handout.pdf' },
  { title: 'Sunum', href: '/files/15-sahabe-efendilerimizin-faziletleri/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/15-sahabe-efendilerimizin-faziletleri/kahoot.pdf' }
]
const sahabelerinAllahResulullahSevgisiFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/16-sahabelerin-allah-resulullah-sevgisi/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/16-sahabelerin-allah-resulullah-sevgisi/handout.pdf' },
  { title: 'Sunum', href: '/files/16-sahabelerin-allah-resulullah-sevgisi/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/16-sahabelerin-allah-resulullah-sevgisi/kahoot.pdf' }
]
const duaEvradTesbihatFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/21-dua-evrad-ezkar-tesbihat/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/21-dua-evrad-ezkar-tesbihat/handout.pdf' },
  { title: 'Sunum', href: '/files/21-dua-evrad-ezkar-tesbihat/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/21-dua-evrad-ezkar-tesbihat/kahoot.pdf' }
]
const cevsenAshabiBedirTevhidnameFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/22-cevsen-ashabi-bedir-tevhidname/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/22-cevsen-ashabi-bedir-tevhidname/handout.pdf' },
  { title: 'Sunum', href: '/files/22-cevsen-ashabi-bedir-tevhidname/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/22-cevsen-ashabi-bedir-tevhidname/kahoot.pdf' }
]
const tevhidDelilleriFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/05-tevhid-delilleri/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/05-tevhid-delilleri/handout.pdf' },
  { title: 'Sunum', href: '/files/05-tevhid-delilleri/sunum.pdf' },
  { title: 'Videolar', href: '/files/05-tevhid-delilleri/videolar.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/05-tevhid-delilleri/kahoot.pdf' }
]
const futuvvetFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/39-futuvvet/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/39-futuvvet/handout.pdf' },
  { title: 'Sunum', href: '/files/39-futuvvet/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/39-futuvvet/kahoot.pdf' }
]
const sadakatVeItaatFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/38-sadakat-ve-itaat/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/38-sadakat-ve-itaat/handout.pdf' },
  { title: 'Sunum', href: '/files/38-sadakat-ve-itaat/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/38-sadakat-ve-itaat/kahoot.pdf' }
]
const comertlikFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/42-comertlik/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/42-comertlik/handout.pdf' },
  { title: 'Sunum', href: '/files/42-comertlik/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/42-comertlik/kahoot.pdf' }
]
const mesuliyetSuuruFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/25-mesuliyet-suuru/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/25-mesuliyet-suuru/handout.pdf' },
  { title: 'Sunum', href: '/files/25-mesuliyet-suuru/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/25-mesuliyet-suuru/kahoot.pdf' }
]
const hucumatiSitteFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/29-hucumati-sitte/ana-calisma-metni.pdf' },
  { title: 'Sorularla Anlatım', href: '/files/29-hucumati-sitte/sorularla-anlatim.pdf' },
  { title: 'Sunum', href: '/files/29-hucumati-sitte/sunum.pdf' },
  { title: 'Handout', href: '/files/29-hucumati-sitte/handout.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/29-hucumati-sitte/kahoot.pdf' }
]
const hayaVeIffetFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/30-haya-ve-iffet/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/30-haya-ve-iffet/handout.pdf' },
  { title: 'Sunum', href: '/files/30-haya-ve-iffet/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/30-haya-ve-iffet/kahoot.pdf' }
]
const sukurVeKanaatFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/31-sukur-kanaat/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/31-sukur-kanaat/handout.pdf' },
  { title: 'Sunum', href: '/files/31-sukur-kanaat/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/31-sukur-kanaat/kahoot.pdf' }
]
const ihlasRisalesiFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/32-ihlas-risalesi/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/32-ihlas-risalesi/handout.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/32-ihlas-risalesi/kahoot.pdf' },
  { title: 'Sunum 1', href: '/files/32-ihlas-risalesi/sunum-1.pdf' },
  { title: 'Sunum 2 – 21. Lem’a: İhlas Risalesi', href: '/files/32-ihlas-risalesi/sunum-2.pdf' },
  { title: '21. Lem’a – İhlas Risalesi', href: '/files/32-ihlas-risalesi/21-lema-ihlas-risalesi.pdf' }
]
const cemaatOlmakFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/34-cemaat-olmak/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/34-cemaat-olmak/handout.pdf' },
  { title: 'Sunum', href: '/files/34-cemaat-olmak/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/34-cemaat-olmak/kahoot.pdf' }
]
const iradeFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/37-irade/ana-calisma-metni.pdf' },
  { title: 'Özet', href: '/files/37-irade/ozet.pdf' },
  { title: 'Sunum', href: '/files/37-irade/sunum.pdf' },
  { title: 'Kahoot! Soruları', href: '/files/37-irade/kahoot.pdf' }
]
const tefekkurKulluktaDerinlesmeFiles = [
  { title: 'Ana Çalışma Metni', href: '/files/45-tefekkur-kullukta-derinlesme/ana-calisma-metni.pdf' },
  { title: 'Handout', href: '/files/45-tefekkur-kullukta-derinlesme/handout.pdf' },
  { title: 'Sorular', href: '/files/45-tefekkur-kullukta-derinlesme/sorular.pdf' },
  { title: 'Sunum', href: '/files/45-tefekkur-kullukta-derinlesme/sunum.pdf' }
]

const specialDayTopics = [
  { no: '01', title: 'Kandiller', files: [] },
  { no: '02', title: 'Ramazan', files: [] },
  { no: '03', title: 'Kurban', files: [] },
  { no: '04', title: 'Weihnachten', files: [] },
  { no: '05', title: 'Ostern', files: [] },
  { no: '06', title: 'Pfingsten', files: [] }
]

const curriculumTopics: Record<string, any[]> = {
  A: [
    { no: '01', title: 'Sohbet-i Cânân', files: sohbetiCananFiles },
    { no: '21', title: 'Dua, Evrâdü’l-Ezkâr, Tesbîhat', files: duaEvradTesbihatFiles },
    { no: '22', title: 'Cevşen, Ashâb-ı Bedir, Tevhidnâme', files: cevsenAshabiBedirTevhidnameFiles },
    { no: '25', title: 'Mesuliyet Şuuru', files: mesuliyetSuuruFiles },
    { no: '29', title: 'Hücûmât-ı Sitte', files: hucumatiSitteFiles },
    { no: '30', title: 'Haya ve İffet', files: hayaVeIffetFiles },
    { no: '31', title: 'Şükür ve Kanaatin Hayattaki Rolü', files: sukurVeKanaatFiles },
    { no: '32', title: 'İhlas Kavramı ve İhlas Risalesi', files: ihlasRisalesiFiles },
    { no: '34', title: 'Cemaat Olmak', files: cemaatOlmakFiles },
    { no: '37', title: 'İrade', files: iradeFiles },
    { no: '38', title: 'Sadakat ve İtaat', files: sadakatVeItaatFiles },
    { no: '39', title: 'Fütüvvet ve Gençliğin Hakkını Verme', files: futuvvetFiles },
    { no: '42', title: 'Cömertlik', files: comertlikFiles },
    { no: '45', title: 'Tefekkür ve Kullukta Derinleşme', files: tefekkurKulluktaDerinlesmeFiles }
  ],
  B: [
    { no: '03', title: 'Allah’a İman', files: allahaImanFiles },
    { no: '05', title: 'Tevhid Delillerinden Bazı Örnekler', files: tevhidDelilleriFiles },
    { no: '06', title: 'Peygamberlere İman', files: peygamberlereImanFiles },
    { no: '11', title: 'Tevrat ve İncil’de Peygamberimizin Nübüvvetine Deliller', files: nubuvveteDelillerFiles },
    { no: '13', title: 'Efendimiz’in (SAV) Şemaili, Ahlakı ve Adabı', files: semailAhlakAdabFiles },
    { no: '15', title: 'Sahabe Efendilerimizin Faziletleri', files: sahabeFaziletleriFiles },
    { no: '16', title: 'Sahabelerin Allah ve Resûlullah Sevgisi', files: sahabelerinAllahResulullahSevgisiFiles },
    { no: '19', title: 'Namaz', files: namazFiles },
    { no: '20', title: 'İş Yoğunluğu Arasında Namaz ve Şeytanın Namaz Hırsızlığı', files: isYogunluguNamazHirsizligiFiles }
  ],
  C: [
    { no: '01', title: 'C Kategorisi Programı', files: [] }
  ],
  'ÖZEL GÜNLER': specialDayTopics
}

const currentTopics = computed(() => {
  return openStep.value ? (curriculumTopics[openStep.value] || []) : []
})

// City Guides Data
const hamburgFood = [
  'Merdane (Helal)',
  'Grand Café Back-Lava (Helal)',
  'Tibarg Kebap Haus (Helal)',
  'Anime Burger (Helal)',
  'Leontes Eis und Kaffee (Dondurma, pizza, helal)'
]

const hamburgStops = [
  { name: 'Alster · Jungfernstieg · Binnenalster', note: 'Tretboot turu', href: 'https://maps.app.goo.gl/5yV8wPWgrSEcvUt37' },
  { name: 'Hamburg Rathaus', href: 'https://maps.app.goo.gl/JQYG7cmCkuB2oiadA' },
  { name: 'Landungsbrücken', note: 'Feribot ve liman manzarası', href: 'https://maps.app.goo.gl/5z7sZLsDF55iK7fd9' },
  { name: 'Alter Elbtunnel', href: 'https://maps.app.goo.gl/NTyj7GpBKN156fbH8' },
  { name: 'Speicherstadt', href: 'https://maps.app.goo.gl/AYZsUQ9ytF3Se5Xe8' },
  { name: 'Elbphilharmonie Plaza', note: 'Ücretsiz seyir platformu', href: 'https://maps.app.goo.gl/rLiGvM6vGLiRSJw69' },
  { name: 'Miniatur Wunderland', note: 'Müze', href: 'https://maps.app.goo.gl/zhbcUB2BWNKcZbBQ8' },
  { name: 'St. Michaelis – Der Michel', note: 'Seyir platformu', href: 'https://maps.app.goo.gl/koAttSPsF3Sgpy6b7' },
  { name: 'Planten un Blomen', note: 'Mayıs–Eylül, saat 21.00’den sonra su ve ışık konseri', href: 'https://maps.app.goo.gl/tYvzXu6oreWVsSYQ9' },
  { name: 'Fischmarkt', note: 'Pazar günleri saat 05.00’ten itibaren', href: 'https://maps.app.goo.gl/DA4qstSF5eUHav6G9' },
  { name: 'Mahnmal St. Nikolai', note: 'Seyir platformu', href: 'https://maps.app.goo.gl/uSgE1CykajzaqeUB9' },
  { name: 'Hamburger Kunsthalle', href: 'https://maps.app.goo.gl/H1X1YdWRYX6a89YTA' },
  { name: 'Westfield Hamburg-Überseequartier', note: 'Alışveriş', href: 'https://maps.app.goo.gl/hiphb8Pm85H4Eow4A' }
]

const hamburgMosques = [
  { name: 'Islamische Gemeinde Hamburg – Centrum Moschee', href: 'https://maps.app.goo.gl/GvsUiZLmGjGctb6y6' },
  { name: 'Moscheegemeinde Altona Ulu Cami', href: 'https://maps.app.goo.gl/TKn8i29GXfzcRdkK7' },
  { name: 'DİTİB Türkisch Islamische Gemeinde', href: 'https://maps.app.goo.gl/5EhTy6AXQKRLLEbu7' }
]

const hamburgInstitutions = [
  'Forum Dialog',
  'Akademikerbund',
  'Die Kraft der Toleranz',
  'Ehil e.V.',
  'Alsterring Gymnasium'
]

const frankfurtFood = [
  'Emir ET Restaurant',
  'Anne Cafe & Restaurant & Catering',
  'BigChefs Frankfurt',
  "Josef's Biofleisch",
  'Nirwana Grill',
  'Restaurant Thai Fun Halal',
  'Sos Döner Frankfurt',
  'Anteplioğlu Frankfurt'
]

const frankfurtStops = [
  { name: 'Main Nehri gezisi', note: 'Nehir kıyısı ve tekne gezisi', query: 'Main river cruise Frankfurt' },
  { name: 'Müzeler Gecesi', note: 'Cumartesi, 25 Nisan 2026', query: 'Nacht der Museen Frankfurt' },
  { name: 'Dippemess', note: '27 Mart–19 Nisan ve 11–27 Eylül 2026', query: 'Dippemess Frankfurt' },
  { name: 'Mehmet Ali Şengül Kabri', note: 'Hanau', query: 'Mehmet Ali Şengül Grab Hanau' }
]

const frankfurtInstitutions = [
  'Avicenna Institut e.V.',
  'RUMI Kulturzentrum Frankfurt e.V.',
  'Forum für Interkulturellen Dialog e.V. (FID e.V.)',
  'Avicenna Institut e.V. (Höchst)'
]

const frankfurtPrayer = [
  'DİTİB Merkez Camii Frankfurt',
  'Bahnhofsmission, Caritasverband Frankfurt e.V.'
]
</script>
