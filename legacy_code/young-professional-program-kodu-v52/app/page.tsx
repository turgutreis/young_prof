"use client";
import { useState } from "react";

const categories = [
  {
    id: "curriculum",
    no: "01",
    title: "Müfredat",
    text: "Adım adım gelişim programları ve dönem planları",
    tone: "curriculumBlue",
    icon: "✦",
  },
  {
    id: "books",
    no: "02",
    title: "Kütüphane",
    text: "Kitap tavsiyeleri, seçilmiş okumalar ve özetler",
    tone: "lime",
    icon: "⌁",
  },
  {
    id: "activities",
    no: "03",
    title: "Aktiviteler / Ünite Çalışmaları",
    text: "Grup çalışmaları, atölyeler ve uygulanabilir etkinlikler",
    tone: "violet",
    icon: "◎",
  },
  {
    id: "routes",
    no: "04",
    title: "Gezi Güzergâhları",
    text: "Kültür, tarih ve doğayı keşfetmek için hazır rotalar",
    tone: "routesGreen",
    icon: "↗",
  },
  {
    id: "news",
    no: "05",
    title: "Duyurular",
    text: "Yeni programlar, buluşmalar ve önemli tarihler",
    tone: "yellow",
    icon: "!",
  },
];
const curriculumSteps = ["A", "B", "C", "ÖZEL GÜNLER"];
const activityPlatforms = [
  "Gençlik Açılım ve Diyalog Platformu",
  "Gençlik Okuma Kulübü",
  "Genç İş İnsanları Platformu",
  "Genç Aile",
  "Genç Spor-Aktivite Platformu",
];
const sohbetiCananFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/01-sohbet-i-canan/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/01-sohbet-i-canan/handout.pdf" },
  { title: "Sunum", href: "/files/01-sohbet-i-canan/sunum.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/01-sohbet-i-canan/kahoot.pdf",
  },
];
const allahaImanFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/03-allaha-iman/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/03-allaha-iman/handout.pdf" },
  { title: "Sunum", href: "/files/03-allaha-iman/sunum.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/03-allaha-iman/kahoot.pdf",
  },
];
const peygamberlereImanFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/06-peygamberlere-iman/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/06-peygamberlere-iman/handout.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/06-peygamberlere-iman/kahoot.pdf",
  },
  { title: "Sunum", href: "/files/06-peygamberlere-iman/sunum.pdf" },
];
const namazFiles = [
  { title: "Ana Çalışma Metni", href: "/files/19-namaz/ana-calisma-metni.pdf" },
  { title: "Handout", href: "/files/19-namaz/handout.pdf" },
  { title: "Sunum", href: "/files/19-namaz/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/19-namaz/kahoot.pdf" },
];
const isYogunluguNamazHirsizligiFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/20-is-yogunlugu-namaz-hirsizligi/ana-calisma-metni.pdf",
  },
  { title: "Özet", href: "/files/20-is-yogunlugu-namaz-hirsizligi/ozet.pdf" },
  { title: "Sunum", href: "/files/20-is-yogunlugu-namaz-hirsizligi/sunum.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/20-is-yogunlugu-namaz-hirsizligi/kahoot.pdf",
  },
];
const nubuvveteDelillerFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/11-nubuvvete-deliller/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/11-nubuvvete-deliller/handout.pdf" },
  { title: "Sunum", href: "/files/11-nubuvvete-deliller/sunum.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/11-nubuvvete-deliller/kahoot.pdf",
  },
];
const semailAhlakAdabFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/13-semail-ahlak-adab/ana-calisma-metni.pdf",
  },
  { title: "Handout 1", href: "/files/13-semail-ahlak-adab/handout-1.pdf" },
  { title: "Handout 2", href: "/files/13-semail-ahlak-adab/handout-2.pdf" },
  { title: "Sunum", href: "/files/13-semail-ahlak-adab/sunum.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/13-semail-ahlak-adab/kahoot.pdf",
  },
];
const sahabeFaziletleriFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/15-sahabe-efendilerimizin-faziletleri/ana-calisma-metni.pdf",
  },
  {
    title: "Handout",
    href: "/files/15-sahabe-efendilerimizin-faziletleri/handout.pdf",
  },
  {
    title: "Sunum",
    href: "/files/15-sahabe-efendilerimizin-faziletleri/sunum.pdf",
  },
  {
    title: "Kahoot! Soruları",
    href: "/files/15-sahabe-efendilerimizin-faziletleri/kahoot.pdf",
  },
];
const sahabelerinAllahResulullahSevgisiFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/16-sahabelerin-allah-resulullah-sevgisi/ana-calisma-metni.pdf",
  },
  {
    title: "Handout",
    href: "/files/16-sahabelerin-allah-resulullah-sevgisi/handout.pdf",
  },
  {
    title: "Sunum",
    href: "/files/16-sahabelerin-allah-resulullah-sevgisi/sunum.pdf",
  },
  {
    title: "Kahoot! Soruları",
    href: "/files/16-sahabelerin-allah-resulullah-sevgisi/kahoot.pdf",
  },
];
const duaEvradTesbihatFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/21-dua-evrad-ezkar-tesbihat/ana-calisma-metni.pdf",
  },
  {
    title: "Handout",
    href: "/files/21-dua-evrad-ezkar-tesbihat/handout.pdf",
  },
  {
    title: "Sunum",
    href: "/files/21-dua-evrad-ezkar-tesbihat/sunum.pdf",
  },
  {
    title: "Kahoot! Soruları",
    href: "/files/21-dua-evrad-ezkar-tesbihat/kahoot.pdf",
  },
];
const cevsenAshabiBedirTevhidnameFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/22-cevsen-ashabi-bedir-tevhidname/ana-calisma-metni.pdf",
  },
  {
    title: "Handout",
    href: "/files/22-cevsen-ashabi-bedir-tevhidname/handout.pdf",
  },
  {
    title: "Sunum",
    href: "/files/22-cevsen-ashabi-bedir-tevhidname/sunum.pdf",
  },
  {
    title: "Kahoot! Soruları",
    href: "/files/22-cevsen-ashabi-bedir-tevhidname/kahoot.pdf",
  },
];
const tevhidDelilleriFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/05-tevhid-delilleri/ana-calisma-metni.pdf",
  },
  {
    title: "Handout",
    href: "/files/05-tevhid-delilleri/handout.pdf",
  },
  {
    title: "Sunum",
    href: "/files/05-tevhid-delilleri/sunum.pdf",
  },
  {
    title: "Videolar",
    href: "/files/05-tevhid-delilleri/videolar.pdf",
  },
  {
    title: "Kahoot! Soruları",
    href: "/files/05-tevhid-delilleri/kahoot.pdf",
  },
];

const curriculumBTopics = [
  { no: "03", title: "Allah’a İman", files: allahaImanFiles },
  {
    no: "05",
    title: "Tevhid Delillerinden Bazı Örnekler",
    files: tevhidDelilleriFiles,
  },
  { no: "06", title: "Peygamberlere İman", files: peygamberlereImanFiles },
  {
    no: "11",
    title: "Tevrat ve İncil’de Peygamberimizin Nübüvvetine Deliller",
    files: nubuvveteDelillerFiles,
  },
  {
    no: "13",
    title: "Efendimiz’in (SAV) Şemaili, Ahlakı ve Adabı",
    files: semailAhlakAdabFiles,
  },
  {
    no: "15",
    title: "Sahabe Efendilerimizin Faziletleri",
    files: sahabeFaziletleriFiles,
  },
  {
    no: "16",
    title: "Sahabelerin Allah ve Resûlullah Sevgisi",
    files: sahabelerinAllahResulullahSevgisiFiles,
  },
  { no: "19", title: "Namaz", files: namazFiles },
  {
    no: "20",
    title: "İş Yoğunluğu Arasında Namaz ve Şeytanın Namaz Hırsızlığı",
    files: isYogunluguNamazHirsizligiFiles,
  },
];
const futuvvetFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/39-futuvvet/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/39-futuvvet/handout.pdf" },
  { title: "Sunum", href: "/files/39-futuvvet/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/39-futuvvet/kahoot.pdf" },
];
const sadakatVeItaatFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/38-sadakat-ve-itaat/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/38-sadakat-ve-itaat/handout.pdf" },
  { title: "Sunum", href: "/files/38-sadakat-ve-itaat/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/38-sadakat-ve-itaat/kahoot.pdf" },
];
const comertlikFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/42-comertlik/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/42-comertlik/handout.pdf" },
  { title: "Sunum", href: "/files/42-comertlik/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/42-comertlik/kahoot.pdf" },
];
const mesuliyetSuuruFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/25-mesuliyet-suuru/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/25-mesuliyet-suuru/handout.pdf" },
  { title: "Sunum", href: "/files/25-mesuliyet-suuru/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/25-mesuliyet-suuru/kahoot.pdf" },
];
const hucumatiSitteFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/29-hucumati-sitte/ana-calisma-metni.pdf",
  },
  {
    title: "Sorularla Anlatım",
    href: "/files/29-hucumati-sitte/sorularla-anlatim.pdf",
  },
  { title: "Sunum", href: "/files/29-hucumati-sitte/sunum.pdf" },
  { title: "Handout", href: "/files/29-hucumati-sitte/handout.pdf" },
  { title: "Kahoot! Soruları", href: "/files/29-hucumati-sitte/kahoot.pdf" },
];
const hayaVeIffetFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/30-haya-ve-iffet/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/30-haya-ve-iffet/handout.pdf" },
  { title: "Sunum", href: "/files/30-haya-ve-iffet/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/30-haya-ve-iffet/kahoot.pdf" },
];
const sukurVeKanaatFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/31-sukur-kanaat/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/31-sukur-kanaat/handout.pdf" },
  { title: "Sunum", href: "/files/31-sukur-kanaat/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/31-sukur-kanaat/kahoot.pdf" },
];
const ihlasRisalesiFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/32-ihlas-risalesi/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/32-ihlas-risalesi/handout.pdf" },
  { title: "Kahoot! Soruları", href: "/files/32-ihlas-risalesi/kahoot.pdf" },
  { title: "Sunum 1", href: "/files/32-ihlas-risalesi/sunum-1.pdf" },
  {
    title: "Sunum 2 – 21. Lem’a: İhlas Risalesi",
    href: "/files/32-ihlas-risalesi/sunum-2.pdf",
  },
  {
    title: "21. Lem’a – İhlas Risalesi",
    href: "/files/32-ihlas-risalesi/21-lema-ihlas-risalesi.pdf",
  },
];
const cemaatOlmakFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/34-cemaat-olmak/ana-calisma-metni.pdf",
  },
  { title: "Handout", href: "/files/34-cemaat-olmak/handout.pdf" },
  { title: "Sunum", href: "/files/34-cemaat-olmak/sunum.pdf" },
  {
    title: "Kahoot! Soruları",
    href: "/files/34-cemaat-olmak/kahoot.pdf",
  },
];
const iradeFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/37-irade/ana-calisma-metni.pdf",
  },
  { title: "Özet", href: "/files/37-irade/ozet.pdf" },
  { title: "Sunum", href: "/files/37-irade/sunum.pdf" },
  { title: "Kahoot! Soruları", href: "/files/37-irade/kahoot.pdf" },
];
const tefekkurKulluktaDerinlesmeFiles = [
  {
    title: "Ana Çalışma Metni",
    href: "/files/45-tefekkur-kullukta-derinlesme/ana-calisma-metni.pdf",
  },
  {
    title: "Handout",
    href: "/files/45-tefekkur-kullukta-derinlesme/handout.pdf",
  },
  {
    title: "Sorular",
    href: "/files/45-tefekkur-kullukta-derinlesme/sorular.pdf",
  },
  {
    title: "Sunum",
    href: "/files/45-tefekkur-kullukta-derinlesme/sunum.pdf",
  },
];
const specialDayTopics = [
  { no: "01", title: "Kandiller", files: [] },
  { no: "02", title: "Ramazan", files: [] },
  { no: "03", title: "Kurban", files: [] },
  { no: "04", title: "Weihnachten", files: [] },
  { no: "05", title: "Ostern", files: [] },
  { no: "06", title: "Pfingsten", files: [] },
];
const curriculumTopics: Record<string, typeof curriculumBTopics> = {
  A: [
    { no: "01", title: "Sohbet-i Cânân", files: sohbetiCananFiles },
    {
      no: "21",
      title: "Dua, Evrâdü’l-Ezkâr, Tesbîhat",
      files: duaEvradTesbihatFiles,
    },
    {
      no: "22",
      title: "Cevşen, Ashâb-ı Bedir, Tevhidnâme",
      files: cevsenAshabiBedirTevhidnameFiles,
    },
    { no: "25", title: "Mesuliyet Şuuru", files: mesuliyetSuuruFiles },
    { no: "29", title: "Hücûmât-ı Sitte", files: hucumatiSitteFiles },
    { no: "30", title: "Haya ve İffet", files: hayaVeIffetFiles },
    {
      no: "31",
      title: "Şükür ve Kanaatin Hayattaki Rolü",
      files: sukurVeKanaatFiles,
    },
    {
      no: "32",
      title: "İhlas Kavramı ve İhlas Risalesi",
      files: ihlasRisalesiFiles,
    },
    { no: "34", title: "Cemaat Olmak", files: cemaatOlmakFiles },
    { no: "37", title: "İrade", files: iradeFiles },
    { no: "38", title: "Sadakat ve İtaat", files: sadakatVeItaatFiles },
    {
      no: "39",
      title: "Fütüvvet ve Gençliğin Hakkını Verme",
      files: futuvvetFiles,
    },
    { no: "42", title: "Cömertlik", files: comertlikFiles },
    {
      no: "45",
      title: "Tefekkür ve Kullukta Derinleşme",
      files: tefekkurKulluktaDerinlesmeFiles,
    },
  ],
  B: curriculumBTopics,
  "ÖZEL GÜNLER": specialDayTopics,
};
const readingPlanBooks = [
  {
    title: "Kur’an’ın Sihirli Ufku: Fatiha ve Bakara Suresi (1–39)",
    author: "M. Fethullah Gülen",
    cover: "/books/2026-27/fatiha-bakara.png",
    href: "https://kitapdunyasi.eu/products/kuranin-sihirli-ufku-fatiha-ve-bakara-suresi-1-39",
  },
  {
    title: "Adanmış Bir Gönül İnsanı: Hacı Ata",
    author: "Muhittin Küçük",
    cover: "/books/2026-27/haci-ata.png",
    href: "https://kitapdunyasi.eu/products/adanmis-bir-gonul-i̇nsani-haci-ata",
  },
  {
    title: "Das Hauptgebet – Mein Augenlicht",
    author: "Şerif Özcan",
    cover: "/books/2026-27/das-hauptgebet.png",
    href: "https://kitapdunyasi.eu/collections/yeni-cikanlar/products/das-hauptgebet-mein-augenlicht",
  },
  {
    title: "Gençlik Rehberi Üzerine",
    author: "Bediüzzaman Said Nursî · Açıklamalar: Abdullah Aymaz",
    cover: "/books/2026-27/genclik-rehberi.png",
    href: "https://kitapdunyasi.eu/products/genclik-rehberi-uzerine-sureyya?_pos=2&_sid=c1694656b&_ss=r",
  },
  {
    title: "İnsan Neyle Yaşar?",
    author: "L. N. Tolstoy",
    cover: "/books/2026-27/insan-neyle-yasar.png",
    href: "https://kitapdunyasi.eu/products/i̇nsan-neyle-yasar-karton-kapak?_pos=2&_sid=18edda30d&_ss=r",
  },
  {
    title: "Yayınlanmayan Lâhika Mektuplarından Seçmeler",
    author: "Bediüzzaman Said Nursî",
    cover: "/books/2026-27/yayinlanmayan-lahika-mektuplari.png",
    href: "https://kitapdunyasi.eu/products/yayinlanmayan-lahika-mektuplari?_pos=1&_sid=c97367bb2&_ss=r",
  },
  {
    title: "40 Hadithe – Essenzielle Lehren des Propheten Muhammed",
    author: "Mit Kommentar von Esat Mavinehir",
    cover: "/books/2026-27/40-hadithe.png",
    href: "https://kitapdunyasi.eu/products/40-hadithe-essenzielle-lehren-des-propheten-muhammed?_pos=1&_sid=2c744cd93&_ss=r",
  },
];
const hamburgFood = [
  "Merdane (Helal)",
  "Grand Café Back-Lava (Helal)",
  "Tibarg Kebap Haus (Helal)",
  "Anime Burger (Helal)",
  "Leontes Eis und Kaffee (Dondurma, pizza, helal)",
];
const hamburgStops = [
  {
    name: "Alster · Jungfernstieg · Binnenalster",
    note: "Tretboot turu",
    href: "https://maps.app.goo.gl/5yV8wPWgrSEcvUt37",
  },
  {
    name: "Hamburg Rathaus",
    href: "https://maps.app.goo.gl/JQYG7cmCkuB2oiadA",
  },
  {
    name: "Landungsbrücken",
    note: "Feribot ve liman manzarası",
    href: "https://maps.app.goo.gl/5z7sZLsDF55iK7fd9",
  },
  {
    name: "Alter Elbtunnel",
    href: "https://maps.app.goo.gl/NTyj7GpBKN156fbH8",
  },
  { name: "Speicherstadt", href: "https://maps.app.goo.gl/AYZsUQ9ytF3Se5Xe8" },
  {
    name: "Elbphilharmonie Plaza",
    note: "Ücretsiz seyir platformu",
    href: "https://maps.app.goo.gl/rLiGvM6vGLiRSJw69",
  },
  {
    name: "Miniatur Wunderland",
    note: "Müze",
    href: "https://maps.app.goo.gl/zhbcUB2BWNKcZbBQ8",
  },
  {
    name: "St. Michaelis – Der Michel",
    note: "Seyir platformu",
    href: "https://maps.app.goo.gl/koAttSPsF3Sgpy6b7",
  },
  {
    name: "Planten un Blomen",
    note: "Mayıs–Eylül, saat 21.00’den sonra ücretsiz su ve ışık konseri",
    href: "https://maps.app.goo.gl/tYvzXu6oreWVsSYQ9",
  },
  {
    name: "Fischmarkt",
    note: "Pazar günleri saat 05.00’ten itibaren",
    href: "https://maps.app.goo.gl/DA4qstSF5eUHav6G9",
  },
  {
    name: "Mahnmal St. Nikolai",
    note: "Seyir platformu",
    href: "https://maps.app.goo.gl/uSgE1CykajzaqeUB9",
  },
  {
    name: "Hamburger Kunsthalle",
    href: "https://maps.app.goo.gl/H1X1YdWRYX6a89YTA",
  },
  {
    name: "Westfield Hamburg-Überseequartier",
    note: "Alışveriş",
    href: "https://maps.app.goo.gl/hiphb8Pm85H4Eow4A",
  },
];
const hamburgMosques = [
  {
    name: "Islamische Gemeinde Hamburg – Centrum Moschee",
    href: "https://maps.app.goo.gl/GvsUiZLmGjGctb6y6",
  },
  {
    name: "Moscheegemeinde Altona Ulu Cami",
    href: "https://maps.app.goo.gl/TKn8i29GXfzcRdkK7",
  },
  {
    name: "DİTİB Türkisch Islamische Gemeinde",
    href: "https://maps.app.goo.gl/5EhTy6AXQKRLLEbu7",
  },
];
const hamburgInstitutions = [
  "Forum Dialog",
  "Akademikerbund",
  "Die Kraft der Toleranz",
  "Ehil e.V.",
  "Alsterring Gymnasium",
];
const frankfurtFood = [
  "Emir ET Restaurant",
  "Anne Cafe & Restaurant & Catering",
  "BigChefs Frankfurt",
  "Josef's Biofleisch",
  "Nirwana Grill",
  "Restaurant Thai Fun Halal",
  "Sos Döner Frankfurt",
  "Anteplioğlu Frankfurt",
];
const frankfurtStops = [
  {
    name: "Main Nehri gezisi",
    note: "Nehir kıyısı ve tekne gezisi",
    query: "Main river cruise Frankfurt",
  },
  {
    name: "Müzeler Gecesi",
    note: "Cumartesi, 25 Nisan 2026",
    query: "Nacht der Museen Frankfurt",
  },
  {
    name: "Dippemess",
    note: "27 Mart–19 Nisan ve 11–27 Eylül 2026",
    query: "Dippemess Frankfurt",
  },
  {
    name: "Mehmet Ali Şengül Kabri",
    note: "Hanau",
    query: "Mehmet Ali Şengül Grab Hanau",
  },
];
const frankfurtInstitutions = [
  "Avicenna Institut e.V.",
  "RUMI Kulturzentrum Frankfurt e.V.",
  "Forum für Interkulturellen Dialog e.V. (FID e.V.)",
  "Avicenna Institut e.V. (Höchst)",
];
const frankfurtPrayer = [
  "DİTİB Merkez Camii Frankfurt",
  "Bahnhofsmission, Caritasverband Frankfurt e.V.",
];

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [openReadingPlan, setOpenReadingPlan] = useState(false);
  const [openCity, setOpenCity] = useState<string | null>(null);
  const [openGuideSection, setOpenGuideSection] = useState<string | null>(null);
  const [openActivityPlatform, setOpenActivityPlatform] = useState<
    string | null
  >(null);
  const toggleCategory = (id: string) => {
    setOpenCategory((current) => (current === id ? null : id));
    setOpenStep(null);
    setOpenTopic(null);
    setOpenReadingPlan(false);
    setOpenCity(null);
    setOpenGuideSection(null);
    setOpenActivityPlatform(null);
  };
  const topicsForOpenStep = openStep ? (curriculumTopics[openStep] ?? []) : [];

  return (
    <main id="top">
      <header className="topbar">
        <a
          className="brand brandLogo"
          href="#top"
          aria-label="Young Professionals EU ana sayfa"
        >
          <img
            src="/young-professionals-eu-header.png"
            alt="Young Professionals EU"
          />
        </a>
        <div className="topbarActions">
          <nav>
            <a href="#kaynaklar">Kaynaklar</a>
            <a href="#duyurular">Duyurular</a>
            <a href="#sorular">Sorular ve Teklifler</a>
            <a href="#hakkimizda">Hakkımızda</a>
          </nav>
          <a className="outlineButton" href="#kaynaklar">
            Bölümleri keşfet <span>↓</span>
          </a>
        </div>
      </header>

      <section className="resources" id="kaynaklar">
        <div className="categoryGrid accordionGrid">
          {categories.map((c) => {
            const isOpen = openCategory === c.id;
            return (
              <article
                key={c.id}
                className={`categoryCard accordionCard ${c.tone} ${isOpen ? "isOpen" : ""}`}
              >
                <button
                  className="categoryTrigger"
                  onClick={() => toggleCategory(c.id)}
                  aria-expanded={isOpen}
                >
                  <div className="cardTop">
                    <span>{c.no}</span>
                    <b>{c.icon}</b>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <div className="cardLink">
                    <span>{isOpen ? "Kapat" : "İçeriği aç"}</span>
                    <b>{isOpen ? "−" : "+"}</b>
                  </div>
                </button>
                {isOpen && (
                  <div className="insidePanel">
                    {c.id === "curriculum" ? (
                      <>
                        <p className="stepLabel">1. Basamak · Kategori seçin</p>
                        <div className="stepButtons">
                          {curriculumSteps.map((step) => (
                            <button
                              key={step}
                              className={`${step === "ÖZEL GÜNLER" ? "stepSpecial" : `step${step}`} ${openStep === step ? "active" : ""}`}
                              onClick={() => {
                                setOpenStep((current) =>
                                  current === step ? null : step,
                                );
                                setOpenTopic(null);
                              }}
                            >
                              <b>{step === "ÖZEL GÜNLER" ? "✦" : step}</b>
                              <span>
                                {step === "ÖZEL GÜNLER"
                                  ? "Özel Günler"
                                  : `${step} Kategorisi`}
                              </span>
                              <i>→</i>
                            </button>
                          ))}
                        </div>
                        {openStep && (
                          <div className="fileShelf curriculumShelf">
                            <div>
                              <span>2. Basamak</span>
                              <h4>
                                {openStep === "ÖZEL GÜNLER"
                                  ? "Özel Günler Dosyaları"
                                  : `${openStep} Kategorisi Dosyaları`}
                              </h4>
                              <p>
                                {topicsForOpenStep.length
                                  ? "PDF dosyalarını görmek için konu başlığına tıklayın."
                                  : "Bu alana ilgili müfredat dosyaları yüklenecek."}
                              </p>
                            </div>
                            {topicsForOpenStep.length ? (
                              <div
                                className={`topicFolders ${openStep === "ÖZEL GÜNLER" ? "topicSpecial" : `topic${openStep}`}`}
                              >
                                {topicsForOpenStep.map((topic) => {
                                  const isTopicOpen = openTopic === topic.no;
                                  return (
                                    <div
                                      className={`topicFolder ${isTopicOpen ? "topicOpen" : ""}`}
                                      key={topic.no}
                                    >
                                      <button
                                        className="folderHead"
                                        onClick={() =>
                                          setOpenTopic((current) =>
                                            current === topic.no
                                              ? null
                                              : topic.no,
                                          )
                                        }
                                        aria-expanded={isTopicOpen}
                                      >
                                        <b>{topic.no}</b>
                                        <div>
                                          <span>KONU DOSYASI</span>
                                          <h5>{topic.title}</h5>
                                        </div>
                                        <i>{isTopicOpen ? "−" : "+"}</i>
                                      </button>
                                      {isTopicOpen &&
                                        (topic.files.length ? (
                                          <div className="pdfList">
                                            {topic.files.map((file) => (
                                              <a
                                                key={file.href}
                                                href={file.href}
                                                target="_blank"
                                                rel="noreferrer"
                                              >
                                                <span className="pdfBadge">
                                                  PDF
                                                </span>
                                                <b>{file.title}</b>
                                                <i>↗</i>
                                              </a>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="filePlaceholder">
                                            <b>＋</b>
                                            <span>Dosyalar eklenecek</span>
                                          </div>
                                        ))}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="filePlaceholder">
                                <b>＋</b>
                                <span>Dosya eklenecek</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : c.id === "books" ? (
                      <div className="libraryPanel">
                        <button
                          className="readingPlanHead"
                          onClick={() =>
                            setOpenReadingPlan((current) => !current)
                          }
                          aria-expanded={openReadingPlan}
                        >
                          <div>
                            <span>2026–27</span>
                            <h4>Okuma Planı</h4>
                            <p>
                              Kitap kapaklarını ve bağlantılarını görüntüleyin.
                            </p>
                          </div>
                          <b>{openReadingPlan ? "−" : "+"}</b>
                        </button>
                        {openReadingPlan && (
                          <div className="bookGrid">
                            {readingPlanBooks.map((book) => (
                              <a
                                className="bookCard"
                                key={book.href}
                                href={book.href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <div className="bookCover">
                                  <img
                                    src={book.cover}
                                    alt={`${book.title} kitap kapağı`}
                                  />
                                  <span>Kitabı incele ↗</span>
                                </div>
                                <h5>{book.title}</h5>
                                <p>{book.author}</p>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : c.id === "activities" ? (
                      <div className="activityPlatforms">
                        <div className="platformIntro">
                          <span>5 ALT PLATFORM</span>
                          <h4>Gençlerin gelişim ve paylaşım alanları</h4>
                          <p>
                            Platform başlığına tıklayarak ilgili alanı
                            açabilirsiniz.
                          </p>
                        </div>
                        <div className="platformList">
                          {activityPlatforms.map((platform, index) => {
                            const isPlatformOpen =
                              openActivityPlatform === platform;
                            return (
                              <div
                                className={`platformItem ${isPlatformOpen ? "platformOpen" : ""}`}
                                key={platform}
                              >
                                <button
                                  onClick={() =>
                                    setOpenActivityPlatform((current) =>
                                      current === platform ? null : platform,
                                    )
                                  }
                                  aria-expanded={isPlatformOpen}
                                >
                                  <b>{String(index + 1).padStart(2, "0")}</b>
                                  <span>{platform}</span>
                                  <i>{isPlatformOpen ? "−" : "+"}</i>
                                </button>
                                {isPlatformOpen && (
                                  <div className="platformContent">
                                    {platform === "Genç Aile" ? (
                                      <a
                                        className="familySeminarCard"
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
                                    ) : platform ===
                                      "Genç İş İnsanları Platformu" ? (
                                      <a
                                        className="familySeminarCard"
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
                                    ) : (
                                      <>
                                        <p>
                                          Bu platforma ait çalışmalar,
                                          etkinlikler ve dosyalar burada
                                          yayınlanacak.
                                        </p>
                                        <span>İçerikler hazırlanıyor</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : c.id === "routes" ? (
                      <div className="citiesPanel">
                        <button
                          className="cityCoverCard"
                          onClick={() => {
                            setOpenCity((current) =>
                              current === "hamburg" ? null : "hamburg",
                            );
                            setOpenGuideSection(null);
                          }}
                          aria-expanded={openCity === "hamburg"}
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/HamburgSpeicherstadt.jpg/1280px-HamburgSpeicherstadt.jpg"
                            alt="Hamburg Speicherstadt gece manzarası"
                          />
                          <span className="cityShade" />
                          <div>
                            <span>ALMANYA · ŞEHİR REHBERİ</span>
                            <h4>Hamburg</h4>
                            <p>Liman, tarih, kültür ve lezzet durakları</p>
                          </div>
                          <b>
                            {openCity === "hamburg"
                              ? "Rehberi kapat −"
                              : "Güzergâhı aç →"}
                          </b>
                        </button>
                        {openCity === "hamburg" && (
                          <div className="cityGuide">
                            <div className="cityGuideIntro">
                              <div>
                                <span>HAMBURG · GEZİ PLANI</span>
                                <h4>Şehri adım adım keşfet</h4>
                                <p>
                                  Duraklar şehir merkezinden liman ve HafenCity
                                  yönüne doğru kolay takip edilebilecek biçimde
                                  düzenlendi.
                                </p>
                              </div>
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Hamburg"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Hamburg haritası ↗
                              </a>
                            </div>
                            <section className="guideBlock routeBlock">
                              <div className="guideNumber">01</div>
                              <div>
                                <button
                                  className="guideSectionToggle"
                                  onClick={() =>
                                    setOpenGuideSection((current) =>
                                      current === "places" ? null : "places",
                                    )
                                  }
                                  aria-expanded={openGuideSection === "places"}
                                >
                                  <span>Gezilecek yerler</span>
                                  <b>
                                    {openGuideSection === "places" ? "−" : "+"}
                                  </b>
                                </button>
                                <p className="guideHint">
                                  Her durağa dokunarak Google Haritalar’da
                                  açabilirsiniz.
                                </p>
                                <div className="routeTimeline">
                                  {hamburgStops.map((stop, index) => (
                                    <a
                                      key={stop.href}
                                      href={stop.href}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <span>
                                        {String(index + 1).padStart(2, "0")}
                                      </span>
                                      <div>
                                        <b>{stop.name}</b>
                                        {stop.note && (
                                          <small>{stop.note}</small>
                                        )}
                                      </div>
                                      <i>↗</i>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </section>
                            <div className="guideColumns">
                              <section className="guideBlock">
                                <div className="guideNumber">02</div>
                                <div>
                                  <button
                                    className="guideSectionToggle"
                                    onClick={() =>
                                      setOpenGuideSection((current) =>
                                        current === "food" ? null : "food",
                                      )
                                    }
                                    aria-expanded={openGuideSection === "food"}
                                  >
                                    <span>Yemek yerleri</span>
                                    <b>
                                      {openGuideSection === "food" ? "−" : "+"}
                                    </b>
                                  </button>
                                  <div className="guideLinkList">
                                    {hamburgFood.map((place) => (
                                      <a
                                        key={place}
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Hamburg`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <span>{place}</span>
                                        <i>↗</i>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </section>
                              <section className="guideBlock">
                                <div className="guideNumber">03</div>
                                <div>
                                  <button
                                    className="guideSectionToggle"
                                    onClick={() =>
                                      setOpenGuideSection((current) =>
                                        current === "prayer" ? null : "prayer",
                                      )
                                    }
                                    aria-expanded={
                                      openGuideSection === "prayer"
                                    }
                                  >
                                    <span>Namaz kılma imkânları</span>
                                    <b>
                                      {openGuideSection === "prayer"
                                        ? "−"
                                        : "+"}
                                    </b>
                                  </button>
                                  <div className="guideLinkList">
                                    {hamburgMosques.map((place) => (
                                      <a
                                        key={place.href}
                                        href={place.href}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <span>{place.name}</span>
                                        <i>↗</i>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </section>
                            </div>
                            <section className="guideBlock institutionsBlock">
                              <div className="guideNumber">04</div>
                              <div>
                                <button
                                  className="guideSectionToggle"
                                  onClick={() =>
                                    setOpenGuideSection((current) =>
                                      current === "institutions"
                                        ? null
                                        : "institutions",
                                    )
                                  }
                                  aria-expanded={
                                    openGuideSection === "institutions"
                                  }
                                >
                                  <span>Kurumlar</span>
                                  <b>
                                    {openGuideSection === "institutions"
                                      ? "−"
                                      : "+"}
                                  </b>
                                </button>
                                <div className="institutionTags">
                                  {hamburgInstitutions.map((name) => (
                                    <span key={name}>{name}</span>
                                  ))}
                                </div>
                              </div>
                            </section>
                            <p className="photoCredit">
                              Kapak fotoğrafı:{" "}
                              <a
                                href="https://commons.wikimedia.org/wiki/File:HamburgSpeicherstadt.jpg"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Niels Fahrenkrog / Wikimedia Commons
                              </a>{" "}
                              · CC BY-SA 4.0
                            </p>
                          </div>
                        )}
                        <button
                          className="cityCoverCard"
                          onClick={() => {
                            setOpenCity((current) =>
                              current === "frankfurt" ? null : "frankfurt",
                            );
                            setOpenGuideSection(null);
                          }}
                          aria-expanded={openCity === "frankfurt"}
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Frankfurt_am_Main_2011_Skyline_origres.jpg"
                            alt="Frankfurt silüeti ve Main Nehri gece manzarası"
                          />
                          <span className="cityShade" />
                          <div>
                            <span>ALMANYA · ŞEHİR REHBERİ</span>
                            <h4>Frankfurt</h4>
                            <p>
                              Main Nehri, kültür, etkinlik ve lezzet durakları
                            </p>
                          </div>
                          <b>
                            {openCity === "frankfurt"
                              ? "Rehberi kapat −"
                              : "Güzergâhı aç →"}
                          </b>
                        </button>
                        {openCity === "frankfurt" && (
                          <div className="cityGuide">
                            <div className="cityGuideIntro">
                              <div>
                                <span>FRANKFURT · GEZİ PLANI</span>
                                <h4>Frankfurt’u adım adım keşfet</h4>
                                <p>
                                  Main Nehri çevresindeki gezi, yemek, kurum ve
                                  namaz imkânları düzenli başlıklar altında
                                  toplandı.
                                </p>
                              </div>
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=Frankfurt"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Frankfurt haritası ↗
                              </a>
                            </div>
                            <section className="guideBlock routeBlock">
                              <div className="guideNumber">01</div>
                              <div>
                                <button
                                  className="guideSectionToggle"
                                  onClick={() =>
                                    setOpenGuideSection((current) =>
                                      current === "frankfurt-places"
                                        ? null
                                        : "frankfurt-places",
                                    )
                                  }
                                  aria-expanded={
                                    openGuideSection === "frankfurt-places"
                                  }
                                >
                                  <span>Gezilecek yerler</span>
                                  <b>
                                    {openGuideSection === "frankfurt-places"
                                      ? "−"
                                      : "+"}
                                  </b>
                                </button>
                                <p className="guideHint">
                                  Her durağa dokunarak Google Haritalar’da
                                  açabilirsiniz.
                                </p>
                                <div className="routeTimeline">
                                  {frankfurtStops.map((stop, index) => (
                                    <a
                                      key={stop.name}
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.query)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <span>
                                        {String(index + 1).padStart(2, "0")}
                                      </span>
                                      <div>
                                        <b>{stop.name}</b>
                                        <small>{stop.note}</small>
                                      </div>
                                      <i>↗</i>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </section>
                            <div className="guideColumns">
                              <section className="guideBlock">
                                <div className="guideNumber">02</div>
                                <div>
                                  <button
                                    className="guideSectionToggle"
                                    onClick={() =>
                                      setOpenGuideSection((current) =>
                                        current === "frankfurt-food"
                                          ? null
                                          : "frankfurt-food",
                                      )
                                    }
                                    aria-expanded={
                                      openGuideSection === "frankfurt-food"
                                    }
                                  >
                                    <span>Yemek yerleri</span>
                                    <b>
                                      {openGuideSection === "frankfurt-food"
                                        ? "−"
                                        : "+"}
                                    </b>
                                  </button>
                                  <div className="guideLinkList">
                                    {frankfurtFood.map((place) => (
                                      <a
                                        key={place}
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Frankfurt`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <span>{place}</span>
                                        <i>↗</i>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </section>
                              <section className="guideBlock">
                                <div className="guideNumber">03</div>
                                <div>
                                  <button
                                    className="guideSectionToggle"
                                    onClick={() =>
                                      setOpenGuideSection((current) =>
                                        current === "frankfurt-prayer"
                                          ? null
                                          : "frankfurt-prayer",
                                      )
                                    }
                                    aria-expanded={
                                      openGuideSection === "frankfurt-prayer"
                                    }
                                  >
                                    <span>Namaz kılma imkânları</span>
                                    <b>
                                      {openGuideSection === "frankfurt-prayer"
                                        ? "−"
                                        : "+"}
                                    </b>
                                  </button>
                                  <div className="guideLinkList">
                                    {frankfurtPrayer.map((place) => (
                                      <a
                                        key={place}
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place} Frankfurt`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <span>{place}</span>
                                        <i>↗</i>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </section>
                            </div>
                            <section className="guideBlock institutionsBlock">
                              <div className="guideNumber">04</div>
                              <div>
                                <button
                                  className="guideSectionToggle"
                                  onClick={() =>
                                    setOpenGuideSection((current) =>
                                      current === "frankfurt-institutions"
                                        ? null
                                        : "frankfurt-institutions",
                                    )
                                  }
                                  aria-expanded={
                                    openGuideSection ===
                                    "frankfurt-institutions"
                                  }
                                >
                                  <span>Kurumlar</span>
                                  <b>
                                    {openGuideSection ===
                                    "frankfurt-institutions"
                                      ? "−"
                                      : "+"}
                                  </b>
                                </button>
                                <div className="guideLinkList">
                                  {frankfurtInstitutions.map((name) => (
                                    <a
                                      key={name}
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Frankfurt`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <span>{name}</span>
                                      <i>↗</i>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </section>
                            <p className="photoCredit">
                              Kapak fotoğrafı:{" "}
                              <a
                                href="https://commons.wikimedia.org/wiki/File:Frankfurt_am_Main_2011_Skyline_origres.jpg"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Thomas Wolf / Wikimedia Commons
                              </a>{" "}
                              · CC BY-SA 3.0
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="fileShelf simpleShelf">
                        <div>
                          <span>İçerik alanı</span>
                          <h4>{c.title}</h4>
                          <p>
                            Bu bölüme ilgili dosyalar ve içerikler eklenecek.
                          </p>
                        </div>
                        <div className="filePlaceholder">
                          <b>＋</b>
                          <span>Dosya eklenecek</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="announcement" id="duyurular">
        <div>
          <p className="eyebrow">
            <span /> Son duyuru
          </p>
          <h2>Yeni dönem buluşması</h2>
          <p>
            Yeni dönem planını birlikte şekillendirmek için fikirlerinle aramıza
            katıl.
          </p>
        </div>
        <div className="date">
          <b>12–13</b>
          <span>
            EYLÜL
            <br />
            2026
          </span>
        </div>
        <a href="mailto:info@young-professionals.eu">Bilgi al ↗</a>
      </section>
      <section className="contactSection" id="sorular">
        <div className="contactIntro">
          <p className="eyebrow">
            <span /> İletişim
          </p>
          <h2>
            Sorular ve
            <br />
            <em>Teklifler</em>
          </h2>
          <p>
            Görüşlerinizi, sorularınızı ve proje tekliflerinizi bizimle
            paylaşabilirsiniz. Mesajınız yalnızca Young Professionals
            yöneticisine gönderilir.
          </p>
          <a href="mailto:info@young-professionals.eu">
            info@young-professionals.eu
          </a>
        </div>
        <form
          className="contactForm"
          action="mailto:info@young-professionals.eu"
          method="post"
          encType="text/plain"
        >
          <label>
            Adınız ve soyadınız
            <input
              name="Ad Soyad"
              type="text"
              required
              placeholder="Adınızı yazın"
            />
          </label>
          <label>
            E-posta adresiniz
            <input
              name="E-posta"
              type="email"
              required
              placeholder="ornek@email.com"
            />
          </label>
          <label>
            Mesaj türü
            <select name="Mesaj Türü" defaultValue="Soru">
              <option>Soru</option>
              <option>Teklif</option>
              <option>Görüş ve öneri</option>
            </select>
          </label>
          <label>
            Mesajınız
            <textarea
              name="Mesaj"
              required
              rows={6}
              placeholder="Mesajınızı buraya yazın..."
            />
          </label>
          <button type="submit">
            Yöneticiye gönder <span>↗</span>
          </button>
          <small>
            Gönder düğmesi cihazınızdaki e-posta uygulamasını açar. Mesajınız
            doğrudan yönetici adresine gider.
          </small>
        </form>
      </section>
      <section className="manifesto" id="hakkimizda">
        <p>YOUNG PROFESSIONALS</p>
        <h2>
          İnanmış Bir Gençlik,
          <br />
          <em>Ümit Dolu Bir Gelecek</em>
        </h2>
        <div className="legalNotice">
          <h3>Hakkımızda ve içerik kullanımı</h3>
          <p>
            Young Professionals, gençlerin eğitimine ve gelişimine katkı
            sunmayı amaçlayan, ticari olmayan bir bilgi ve paylaşım
            platformudur. Sitedeki içerikler genel bilgilendirme amacı taşır;
            hukuki veya profesyonel danışmanlık yerine geçmez.
          </p>
          <p>
            Özgün metinlerin, tasarımların ve dosyaların izinsiz çoğaltılması,
            değiştirilmesi, yayımlanması veya ticari amaçla kullanılması
            yasaktır. Kaynak gösterilen içeriklerin hakları ilgili hak
            sahiplerine aittir. Haricî bağlantıların içeriğinden ilgili site
            sağlayıcıları sorumludur.
          </p>
          <p>
            Hak ihlali, düzeltme veya kaldırma talepleri için: {" "}
            <a href="mailto:info@young-professionals.eu">
              info@young-professionals.eu
            </a>
          </p>
        </div>
      </section>
      <footer>
        <a
          className="brand brandLogo footerLogo"
          href="#top"
          aria-label="Young Professionals ana sayfa"
        >
          <img src="/young-professionals-logo.png" alt="Young Professionals" />
        </a>
        <p>Gençler için, gençlerle birlikte.</p>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
