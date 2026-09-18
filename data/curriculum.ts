import type { CurriculumStep, CurriculumTopic } from '~/types'
import { createTopicFiles, getR2Url } from '~/utils/r2'

export const curriculumSteps: CurriculumStep[] = ['A', 'B', 'C', 'ÖZEL GÜNLER']

/**
 * Category A Topics (19 topics total, sorted by number)
 */
export const categoryATopics: CurriculumTopic[] = [
  {
    no: '01',
    title: 'Sohbet-i Cânân',
    files: createTopicFiles('01-sohbet-i-canan')
  },
  {
    no: '21',
    title: 'Dua, Evrâdü’l-Ezkâr, Tesbîhat',
    files: createTopicFiles('21-dua-evrad-ezkar-tesbihat')
  },
  {
    no: '22',
    title: 'Cevşen, Ashâb-ı Bedir, Tevhidnâme',
    files: createTopicFiles('22-cevsen-ashabi-bedir-tevhidname')
  },
  {
    no: '23',
    title: 'Kur’an Okuma ve Kur’an ile Olması Gereken İrtibatımız',
    files: createTopicFiles('23-kuran-okuma-ve-kuran-ile-olmasi-gereken-irtibatimiz')
  },
  {
    no: '24',
    title: 'İrşad ve Tebliğ',
    files: createTopicFiles('24-irsad-ve-teblig')
  },
  {
    no: '25',
    title: 'Mesuliyet Şuuru',
    files: createTopicFiles('25-mesuliyet-suuru')
  },
  {
    no: '26',
    title: 'Vefa ve Fedakarlık',
    files: createTopicFiles('26-vefa-ve-fedakarlik')
  },
  {
    no: '29',
    title: 'Hücûmât-ı Sitte',
    files: [
      { title: 'Ana Çalışma Metni', href: getR2Url('files/29-hucumati-sitte/ana-calisma-metni.pdf') },
      { title: 'Sorularla Anlatım', href: getR2Url('files/29-hucumati-sitte/sorularla-anlatim.pdf') },
      { title: 'Sunum', href: getR2Url('files/29-hucumati-sitte/sunum.pdf') },
      { title: 'Handout', href: getR2Url('files/29-hucumati-sitte/handout.pdf') },
      { title: 'Kahoot! Soruları', href: getR2Url('files/29-hucumati-sitte/kahoot.pdf') }
    ]
  },
  {
    no: '30',
    title: 'Haya ve İffet',
    files: createTopicFiles('30-haya-ve-iffet')
  },
  {
    no: '31',
    title: 'Şükür ve Kanaatin Hayattaki Rolü',
    files: createTopicFiles('31-sukur-kanaat')
  },
  {
    no: '32',
    title: 'İhlas Kavramı ve İhlas Risalesi',
    files: [
      { title: 'Ana Çalışma Metni', href: getR2Url('files/32-ihlas-risalesi/ana-calisma-metni.pdf') },
      { title: 'Handout', href: getR2Url('files/32-ihlas-risalesi/handout.pdf') },
      { title: 'Kahoot! Soruları', href: getR2Url('files/32-ihlas-risalesi/kahoot.pdf') },
      { title: 'Sunum 1', href: getR2Url('files/32-ihlas-risalesi/sunum-1.pdf') },
      { title: 'Sunum 2 – 21. Lem’a: İhlas Risalesi', href: getR2Url('files/32-ihlas-risalesi/sunum-2.pdf') },
      { title: '21. Lem’a – İhlas Risalesi', href: getR2Url('files/32-ihlas-risalesi/21-lema-ihlas-risalesi.pdf') }
    ]
  },
  {
    no: '34',
    title: 'Cemaat Olmak',
    files: createTopicFiles('34-cemaat-olmak')
  },
  {
    no: '37',
    title: 'İrade',
    files: createTopicFiles('37-irade', { handout: false, ozet: true })
  },
  {
    no: '38',
    title: 'Sadakat ve İtaat',
    files: createTopicFiles('38-sadakat-ve-itaat')
  },
  {
    no: '39',
    title: 'Fütüvvet ve Gençliğin Hakkını Verme',
    files: createTopicFiles('39-futuvvet')
  },
  {
    no: '40',
    title: 'Sabır ve Sebat',
    files: createTopicFiles('40-sabir-ve-sebat')
  },
  {
    no: '42',
    title: 'Cömertlik',
    files: createTopicFiles('42-comertlik')
  },
  {
    no: '45',
    title: 'Tefekkür ve Kullukta Derinleşme',
    files: [
      { title: 'Ana Çalışma Metni', href: getR2Url('files/45-tefekkur-kullukta-derinlesme/ana-calisma-metni.pdf') },
      { title: 'Handout', href: getR2Url('files/45-tefekkur-kullukta-derinlesme/handout.pdf') },
      { title: 'Sorular', href: getR2Url('files/45-tefekkur-kullukta-derinlesme/sorular.pdf') },
      { title: 'Sunum', href: getR2Url('files/45-tefekkur-kullukta-derinlesme/sunum.pdf') }
    ]
  },
  {
    no: '46',
    title: 'Vefa Hissi ile Kulluğa Devam',
    files: createTopicFiles('46-vefa-hissi-ile-kulluga-devam')
  }
]

/**
 * Category B Topics (14 topics total, sorted by number)
 */
export const categoryBTopics: CurriculumTopic[] = [
  {
    no: '02',
    title: 'İman',
    files: createTopicFiles('02-iman')
  },
  {
    no: '03',
    title: 'Allah’a İman',
    files: createTopicFiles('03-allaha-iman')
  },
  {
    no: '05',
    title: 'Tevhid Delillerinden Bazı Örnekler',
    files: [
      { title: 'Ana Çalışma Metni', href: getR2Url('files/05-tevhid-delilleri/ana-calisma-metni.pdf') },
      { title: 'Handout', href: getR2Url('files/05-tevhid-delilleri/handout.pdf') },
      { title: 'Sunum', href: getR2Url('files/05-tevhid-delilleri/sunum.pdf') },
      { title: 'Videolar', href: getR2Url('files/05-tevhid-delilleri/videolar.pdf') },
      { title: 'Kahoot! Soruları', href: getR2Url('files/05-tevhid-delilleri/kahoot.pdf') }
    ]
  },
  {
    no: '06',
    title: 'Peygamberlere İman',
    files: createTopicFiles('06-peygamberlere-iman')
  },
  {
    no: '07',
    title: 'Peygamber ve Tevhid Uğruna Katlandıkları',
    files: createTopicFiles('07-peygamber-ve-tevhid-ugruna-katlandiklari')
  },
  {
    no: '09',
    title: 'Ölüm ve Berzah Hayatı',
    files: createTopicFiles('09-olum-ve-berzah-hayati')
  },
  {
    no: '10',
    title: 'Cennet ve Cehennem',
    files: createTopicFiles('10-cennet-ve-cehennem')
  },
  {
    no: '11',
    title: 'Tevrat ve İncil’de Peygamberimizin Nübüvvetine Deliller',
    files: createTopicFiles('11-nubuvvete-deliller')
  },
  {
    no: '13',
    title: 'Efendimiz’in (SAV) Şemaili, Ahlakı ve Adabı',
    files: [
      { title: 'Ana Çalışma Metni', href: getR2Url('files/13-semail-ahlak-adab/ana-calisma-metni.pdf') },
      { title: 'Handout 1', href: getR2Url('files/13-semail-ahlak-adab/handout-1.pdf') },
      { title: 'Handout 2', href: getR2Url('files/13-semail-ahlak-adab/handout-2.pdf') },
      { title: 'Sunum', href: getR2Url('files/13-semail-ahlak-adab/sunum.pdf') },
      { title: 'Kahoot! Soruları', href: getR2Url('files/13-semail-ahlak-adab/kahoot.pdf') }
    ]
  },
  {
    no: '15',
    title: 'Sahabe Efendilerimizin Faziletleri',
    files: createTopicFiles('15-sahabe-efendilerimizin-faziletleri')
  },
  {
    no: '16',
    title: 'Sahabelerin Allah ve Resûlullah Sevgisi',
    files: createTopicFiles('16-sahabelerin-allah-resulullah-sevgisi')
  },
  {
    no: '17',
    title: 'Kulluk ve İbadet Sorumluluğu',
    files: createTopicFiles('17-kulluk-ve-ibadet-sorumlulugu')
  },
  {
    no: '19',
    title: 'Namaz',
    files: createTopicFiles('19-namaz')
  },
  {
    no: '20',
    title: 'İş Yoğunluğu Arasında Namaz ve Şeytanın Namaz Hırsızlığı',
    files: createTopicFiles('20-is-yogunlugu-namaz-hirsizligi', { handout: false, ozet: true })
  }
]

/**
 * Category C Topics
 */
export const categoryCTopics: CurriculumTopic[] = [
  { no: '01', title: 'C Kategorisi Programı', files: [] }
]

/**
 * Special Days Topics
 */
export const specialDayTopics: CurriculumTopic[] = [
  { no: '01', title: 'Kandiller', files: createTopicFiles('kandiller') },
  { no: '02', title: 'Ramazan', files: createTopicFiles('ramazan') },
  { no: '03', title: 'Kurban', files: createTopicFiles('kurban') },
  { no: '04', title: 'Weihnachten', files: createTopicFiles('weihnachten') },
  { no: '05', title: 'Ostern', files: createTopicFiles('ostern') },
  { no: '06', title: 'Pfingsten', files: createTopicFiles('pfingsten') }
]

/**
 * Complete Curriculum mapping by step
 */
export const curriculumTopics: Record<CurriculumStep, CurriculumTopic[]> = {
  A: categoryATopics,
  B: categoryBTopics,
  C: categoryCTopics,
  'ÖZEL GÜNLER': specialDayTopics
}
