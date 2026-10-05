import fs from 'node:fs'
import { S3Client, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')]
    })
)

const s3 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
})

// Define all target copies
const copies = [
  // 02 Iman
  {
    source: 'files/02 - İMAN /ANA ÇALIŞMA METNİ - İMAN .pdf',
    targets: ['files/02-iman/ana-calisma-metni.pdf']
  },
  {
    source: 'files/02 - İMAN /HANDOUT - İMAN .png',
    targets: ['files/02-iman/handout.png', 'files/02-iman/handout.pdf']
  },
  {
    source: 'files/02 - İMAN /KAHOOT! - iMAN .pdf',
    targets: ['files/02-iman/kahoot.pdf']
  },
  {
    source: 'files/02 - İMAN /SUNUM - İMAN .pdf',
    targets: ['files/02-iman/sunum.pdf']
  },

  // 07 Peygamberler
  {
    source: 'files/07 - PEYGAMBERLER VE TEVHİD UĞRUNA KATLANDIKLARI /ANA CALISMA METNI - Peygamberler ve Teblig Ugruna Katlandiklari.pdf',
    targets: ['files/07-peygamber-ve-tevhid-ugruna-katlandiklari/ana-calisma-metni.pdf']
  },
  {
    source: 'files/07 - PEYGAMBERLER VE TEVHİD UĞRUNA KATLANDIKLARI /HANDOUT-Peygamberler ve Tevhid Ugruna Katlandiklari.pdf',
    targets: ['files/07-peygamber-ve-tevhid-ugruna-katlandiklari/handout.pdf']
  },
  {
    source: 'files/07 - PEYGAMBERLER VE TEVHİD UĞRUNA KATLANDIKLARI /KAHOOT SORULARI - Peygamberler ve Tevhid Ugruna Katlandiklari.pdf',
    targets: ['files/07-peygamber-ve-tevhid-ugruna-katlandiklari/kahoot.pdf']
  },
  {
    source: 'files/07 - PEYGAMBERLER VE TEVHİD UĞRUNA KATLANDIKLARI /SUNUM - TEVHİD ADINA PEYGAMNBERLERIN KATLANDIKLARI .pdf',
    targets: ['files/07-peygamber-ve-tevhid-ugruna-katlandiklari/sunum.pdf']
  },
  {
    source: 'files/07 - PEYGAMBERLER VE TEVHİD UĞRUNA KATLANDIKLARI /KISSALAR - Peygamberler ve Tevhid Ugruna Katlandiklari.pdf',
    targets: ['files/07-peygamber-ve-tevhid-ugruna-katlandiklari/kissalar.pdf']
  },
  {
    source: 'files/07 - PEYGAMBERLER VE TEVHİD UĞRUNA KATLANDIKLARI /VIDEO KAYNAKLAR - Peygamberler ve Tevhid Ugruna Katlandiklari.pdf',
    targets: ['files/07-peygamber-ve-tevhid-ugruna-katlandiklari/video-kaynaklar.pdf']
  },

  // 09 Olum ve Berzah Hayati
  {
    source: 'files/09 - ÖLÜM VE BERZAH HAYATI /ANA ÇALIŞMA METNİ - ÖLÜM VE BERZAH HAYATI.pdf',
    targets: ['files/09-olum-ve-berzah-hayati/ana-calisma-metni.pdf']
  },
  {
    source: 'files/09 - ÖLÜM VE BERZAH HAYATI /HANDOUT - ÖLÜM VE BERZAH HAYATI .pdf',
    targets: ['files/09-olum-ve-berzah-hayati/handout.pdf']
  },
  {
    source: 'files/09 - ÖLÜM VE BERZAH HAYATI /KONU İLE İLGİLİ MÜZAKERE SORULARI.pdf',
    targets: ['files/09-olum-ve-berzah-hayati/kahoot.pdf', 'files/09-olum-ve-berzah-hayati/sorular.pdf']
  },
  {
    source: 'files/09 - ÖLÜM VE BERZAH HAYATI /SUNUM - ÖLÜM VE BERZAH HAYATI..pdf',
    targets: ['files/09-olum-ve-berzah-hayati/sunum.pdf']
  },

  // 10 Cennet ve Cehennem
  {
    source: 'files/10 - CENNET VE CEHENNEM /ANA ÇALIŞMA METNİ - CENNET VE CEHENNEM.pdf',
    targets: ['files/10-cennet-ve-cehennem/ana-calisma-metni.pdf']
  },
  {
    source: 'files/10 - CENNET VE CEHENNEM /HANDOUT - CENNET VE CEHENNEM.pdf',
    targets: ['files/10-cennet-ve-cehennem/handout.pdf']
  },
  {
    source: 'files/10 - CENNET VE CEHENNEM /MÜZAKERE SORULARI - CENNET VE CEHENNEM.pdf',
    targets: ['files/10-cennet-ve-cehennem/kahoot.pdf', 'files/10-cennet-ve-cehennem/sorular.pdf']
  },
  {
    source: 'files/10 - CENNET VE CEHENNEM /SUNUM - CENNET VE CEHENNEM.pdf',
    targets: ['files/10-cennet-ve-cehennem/sunum.pdf']
  },

  // 17 Kulluk ve Ibadet Sorumlulugu
  {
    source: 'files/17 - KULLUK ve İBADET SORUMLULUĞU/ANA ÇALIŞMA METNİ - KULLUK VE İBADET SORUMLULUĞU .pdf',
    targets: ['files/17-kulluk-ve-ibadet-sorumlulugu/ana-calisma-metni.pdf']
  },
  {
    source: 'files/17 - KULLUK ve İBADET SORUMLULUĞU/HANDOUT - KULLUK VE İBADET SORUMLULUĞU.png',
    targets: ['files/17-kulluk-ve-ibadet-sorumlulugu/handout.png', 'files/17-kulluk-ve-ibadet-sorumlulugu/handout.pdf']
  },
  {
    source: 'files/17 - KULLUK ve İBADET SORUMLULUĞU/KAHOOT! - KULLUK VE İBADET SORUMLULUĞU.png',
    targets: ['files/17-kulluk-ve-ibadet-sorumlulugu/kahoot.png', 'files/17-kulluk-ve-ibadet-sorumlulugu/kahoot.pdf']
  },
  {
    source: 'files/17 - KULLUK ve İBADET SORUMLULUĞU/SUNUM - KULLUK VE İBADET SORUMLULUĞU.pdf',
    targets: ['files/17-kulluk-ve-ibadet-sorumlulugu/sunum.pdf']
  },

  // 23 Kuran Okuma
  {
    source: 'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/ana-c-alis-ma-metni-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz-.pdf',
    targets: [
      'files/23-kuran-okuma-ve-kuran-ile-olmasi-gereken-irtibatimiz/ana-calisma-metni.pdf',
      'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/ana-calisma-metni.pdf'
    ]
  },
  {
    source: 'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/handout-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz-.pdf',
    targets: [
      'files/23-kuran-okuma-ve-kuran-ile-olmasi-gereken-irtibatimiz/handout.pdf',
      'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/handout.pdf'
    ]
  },
  {
    source: 'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/kahoot-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz-.pdf',
    targets: [
      'files/23-kuran-okuma-ve-kuran-ile-olmasi-gereken-irtibatimiz/kahoot.pdf',
      'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/kahoot.pdf'
    ]
  },
  {
    source: 'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/sunum-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz-.pdf',
    targets: [
      'files/23-kuran-okuma-ve-kuran-ile-olmasi-gereken-irtibatimiz/sunum.pdf',
      'files/23-kur-an-okuma-ve-kur-an-i-le-olmasi-gereken-i-rti-batimiz/sunum.pdf'
    ]
  },

  // 24 Irsad ve Teblig
  {
    source: 'files/24 - İRŞAD VE TEBLİĞ /ANA ÇALIŞMA METNİ - TEBLIĞ VE İRŞAD.pdf',
    targets: ['files/24-irsad-ve-teblig/ana-calisma-metni.pdf']
  },
  {
    source: 'files/24 - İRŞAD VE TEBLİĞ /HANDOUT - İRŞAD VE TEBLİĞ.png',
    targets: ['files/24-irsad-ve-teblig/handout.png', 'files/24-irsad-ve-teblig/handout.pdf']
  },
  {
    source: 'files/24 - İRŞAD VE TEBLİĞ /KAHOOT! - TEBLIĞ VE İRŞAD.pdf',
    targets: ['files/24-irsad-ve-teblig/kahoot.pdf']
  },
  {
    source: 'files/24 - İRŞAD VE TEBLİĞ /GÖRSEL KAYNAKLAR - TEBLIĞ VE İRŞAD.pdf',
    targets: ['files/24-irsad-ve-teblig/sunum.pdf', 'files/24-irsad-ve-teblig/gorsel-kaynaklar.pdf']
  },

  // 26 Vefa ve Fedakarlik
  {
    source: 'files/26 - VEFA VE FEDAKARLIK /ANA ÇALIŞMA METNİ - VEFA ve FEDAKARLIK .pdf',
    targets: ['files/26-vefa-ve-fedakarlik/ana-calisma-metni.pdf']
  },
  {
    source: 'files/26 - VEFA VE FEDAKARLIK /HANDOUT - VEFA VE FEDAKARLIK .jpeg',
    targets: ['files/26-vefa-ve-fedakarlik/handout.jpeg', 'files/26-vefa-ve-fedakarlik/handout.pdf']
  },
  {
    source: 'files/26 - VEFA VE FEDAKARLIK /KAHOOT! - VEFA VE FEDAKARLIK .pdf',
    targets: ['files/26-vefa-ve-fedakarlik/kahoot.pdf']
  },
  {
    source: 'files/26 - VEFA VE FEDAKARLIK /SUNUM - VEFA ve FEDAKARLIK .pdf',
    targets: ['files/26-vefa-ve-fedakarlik/sunum.pdf']
  },

  // 40 Sabir ve Sebat
  {
    source: 'files/40 - SABIR VE SEBAT /ANA ÇALIŞMA METNİ - SABIR VE SEBAT.pdf',
    targets: ['files/40-sabir-ve-sebat/ana-calisma-metni.pdf']
  },
  {
    source: 'files/40 - SABIR VE SEBAT /HANDOUT - SABIR VE SEBAT .png',
    targets: ['files/40-sabir-ve-sebat/handout.png', 'files/40-sabir-ve-sebat/handout.pdf']
  },
  {
    source: 'files/40 - SABIR VE SEBAT /KAHOOT! -  SABIR VE SEBAT.pdf',
    targets: ['files/40-sabir-ve-sebat/kahoot.pdf']
  },
  {
    source: 'files/40 - SABIR VE SEBAT /SUNUM - SABIR VE SEBAT.pdf',
    targets: ['files/40-sabir-ve-sebat/sunum.pdf']
  },

  // 46 Vefa Hissi ile Kulluga Devam
  {
    source: 'files/46 - VEFA HİSSİ İLE KULLUĞA DEVAM/ANA ÇALIŞMA METNİ - VEFA HİSSİ İLE KULLUĞA DEVAM .pdf',
    targets: ['files/46-vefa-hissi-ile-kulluga-devam/ana-calisma-metni.pdf']
  },
  {
    source: 'files/46 - VEFA HİSSİ İLE KULLUĞA DEVAM/HANDOUT - VEFA HİSSİ İLE KULLUĞA DEVAM.png',
    targets: ['files/46-vefa-hissi-ile-kulluga-devam/handout.png', 'files/46-vefa-hissi-ile-kulluga-devam/handout.pdf']
  },
  {
    source: 'files/46 - VEFA HİSSİ İLE KULLUĞA DEVAM/KAHOOT! - VEFA HİSSİ İLE KULLUĞA DEVAM.pdf',
    targets: ['files/46-vefa-hissi-ile-kulluga-devam/kahoot.pdf']
  },
  {
    source: 'files/46 - VEFA HİSSİ İLE KULLUĞA DEVAM/SUNUM 1-VEFA HİSSİ İLE KULLUĞA DEVAM .pdf',
    targets: ['files/46-vefa-hissi-ile-kulluga-devam/sunum.pdf', 'files/46-vefa-hissi-ile-kulluga-devam/sunum-1.pdf']
  },
  {
    source: 'files/46 - VEFA HİSSİ İLE KULLUĞA DEVAM/SUNUM 2 VEFA HİSSİ İLE KULLUĞA DEVAM .pdf',
    targets: ['files/46-vefa-hissi-ile-kulluga-devam/sunum-2.pdf']
  },

  // Kurban
  {
    source: 'files/kurban/1.ANA ÇALIŞMA METNİ - KURBAN .pdf',
    targets: ['files/kurban/ana-calisma-metni.pdf']
  },
  {
    source: 'files/kurban/2.SUNUM - KURBAN.pdf',
    targets: ['files/kurban/sunum.pdf']
  },
  {
    source: 'files/kurban/3.HANDOUT - KURBAN.jpg',
    targets: ['files/kurban/handout.jpg', 'files/kurban/handout.pdf']
  },
  {
    source: 'files/kurban/4.KAHOOT! - KURBAN.pdf',
    targets: ['files/kurban/kahoot.pdf']
  }
]

async function runAll() {
  console.log(`Starting migration of ${copies.length} source file sets...`)
  let successCount = 0
  let skipCount = 0

  for (const item of copies) {
    const copySource = `${env.R2_BUCKET_NAME}/${encodeURI(item.source)}`
    for (const target of item.targets) {
      try {
        await s3.send(new CopyObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          CopySource: copySource,
          Key: target
        }))
        console.log(`✅ Copied: ${item.source} -> ${target}`)
        successCount++
      } catch (err) {
        console.error(`❌ Failed: ${item.source} -> ${target}:`, err.message)
      }
    }
  }

  console.log(`Finished: ${successCount} successful copies!`)
}

runAll().catch(console.error)
