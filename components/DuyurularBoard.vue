<template>
  <div class="mb-8">
    <v-card class="islamic-card pa-6 mb-6 elevation-4" elevation="0">
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-2">
        <div class="d-flex align-center">
          <v-avatar color="cyan-darken-1" size="44" class="mr-3 elevation-2">
            <v-icon icon="mdi-bullhorn-outline" color="white" size="24"></v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold font-cinzel">Haftalık Duyurular & Program Panosu</h3>
            <div class="text-caption text-medium-emphasis">Gençlik sohbetleri ve etkinlik takvimi</div>
          </div>
        </div>
        <v-chip color="secondary" variant="flat" size="small" class="font-weight-bold">
          <v-icon icon="mdi-calendar-star" start size="x-small"></v-icon> Güncel
        </v-chip>
      </div>

      <v-row>
        <v-col
          v-for="item in announcements"
          :key="item.id"
          cols="12"
          md="6"
        >
          <v-card class="islamic-card pa-5 h-100 border" elevation="0" style="background: rgba(15, 30, 25, 0.45) !important;">
            <div class="d-flex align-start justify-space-between mb-2">
              <v-chip size="x-small" :color="item.badgeColor" variant="flat" class="font-weight-bold">
                {{ item.category }}
              </v-chip>
              <span class="text-caption text-medium-emphasis font-weight-medium">
                <v-icon icon="mdi-clock-outline" size="x-small" class="mr-1"></v-icon>
                {{ item.date }}
              </span>
            </div>

            <h4 class="text-subtitle-1 font-weight-bold mb-2">
              {{ item.title }}
            </h4>
            <p class="text-caption text-medium-emphasis mb-3" style="line-height: 1.5;">
              {{ item.content }}
            </p>

            <div class="d-flex align-center justify-space-between pt-2 border-t border-opacity-10 text-caption">
              <span class="font-weight-medium text-secondary">
                <v-icon icon="mdi-map-marker-outline" size="x-small" class="mr-1"></v-icon>
                {{ item.location }}
              </span>
              <v-chip size="x-small" variant="tonal" color="primary">
                {{ item.status }}
              </v-chip>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const announcements = [
  {
    id: 1,
    title: 'Haftalık Gençlik Sohbeti & Mütalaa',
    category: 'SOHBET BULUŞMASI',
    badgeColor: 'emerald',
    date: 'Her Pazar 18:30',
    location: 'İlim & Gençlik Merkezi',
    content: 'Bu haftaki konumuz: "Namaz İbadeti ve Kazandırdıkları" üzerine sunum ve tahlil çalışması yapılacaktır. Tüm gençlerimiz davetlidir.',
    status: 'Aktif Program'
  },
  {
    id: 2,
    title: 'Aylık Kitap Tahlili: Fütüvvet Ahlakı',
    category: 'KİTAP OKUMA',
    badgeColor: 'amber-darken-2',
    date: 'Ayın Son Cumartesisi 15:00',
    location: 'Kütüphane Salonu',
    content: 'Tavsiye Kitaplar listemizdeki temel eserlerden biri olan Gençlik ve Fütüvvet risalesinin ortak müzakeresi gerçekleştirilecektir.',
    status: 'Kayıt Açık'
  },
  {
    id: 3,
    title: 'Tarihi Külliyeler & Gezi Rotası',
    category: 'KÜLTÜR GEZİSİ',
    badgeColor: 'indigo',
    date: 'Önümüzdeki Ay Sonu',
    location: 'Şehir Rehberi Rotaları',
    content: 'Gezi Güzergahları rehberimiz doğrultusunda tarihi mekanları ve vakıf eserlerini yerinde inceleyeceğimiz kültür turu programımız.',
    status: 'Planlanıyor'
  },
  {
    id: 4,
    title: 'İnteraktif Kahoot Ünite Değerlendirmesi',
    category: 'BİLGİ YARIŞMASI',
    badgeColor: 'rose',
    date: 'Ünite Bitimlerinde',
    location: 'Online & Yüz Yüze',
    content: 'Tamamlanan her müfredat ünitesinin ardından eğlenceli ve pekiştirici Kahoot bilgi yarışmaları düzenlenmektedir.',
    status: 'Sürekli'
  }
]
</script>
