# 📖 Datenverwaltung & Wartungsanleitung (Content Guide)

Dieses Verzeichnis enthält alle modularen Daten der Webseite **Young Professionals EU**.
Hier können Inhalte schnell, übersichtlich und ohne Berührung des UI-Codes (`app.vue`) gepflegt werden.

---

## 📁 Strukturübersicht

| Datei | Inhalt |
|---|---|
| [`curriculum.ts`](./curriculum.ts) | **Müfredat**: Stufen A, B, C und Özel Günler (Themen, PDFs, Sunum, Kahoot) |
| [`library.ts`](./library.ts) | **Kütüphane**: Bücher & 2026–27 Leseplan (Titel, Cover, Links) |
| [`activities.ts`](./activities.ts) | **Aktiviteler**: 5 Jugendplattformen, Event-Flyer & Seminare |
| [`cityGuides.ts`](./cityGuides.ts) | **Gezi Güzergâhları**: Hamburg & Frankfurt (Sehenswürdigkeiten, Essen, Moscheen, Institutionen) |
| [`categories.ts`](./categories.ts) | **Kategorien**: Metadaten, Nummern und Farben der 5 Hauptsektionen |

---

## 🚀 Häufige Aufgaben (How-To)

### 1. Ein neues Müfredat-Thema hinzufügen (z. B. zu `Özel Günler` oder Stufe `A`)
1. Lade die entsprechenden PDF-Dateien in Cloudflare R2 in den Ordner `files/<dein-thema-slug>/` hoch.
   Standard-Dateinamen:
   - `ana-calisma-metni.pdf`
   - `handout.pdf`
   - `sunum.pdf`
   - `kahoot.pdf`

2. Öffne [`curriculum.ts`](./curriculum.ts) und füge das Thema einfach mit `createTopicFiles` hinzu:
   ```ts
   // Beispiel: Kurban zu Özel Günler hinzufügen:
   {
     no: '03',
     title: 'Kurban',
     files: createTopicFiles('kurban')
   }
   ```
   *Falls das Thema z. B. nur eine Zusammenfassung (`ozet.pdf`) statt Handout hat:*
   ```ts
   {
     no: '03',
     title: 'Kurban',
     files: createTopicFiles('kurban', { handout: false, ozet: true })
   }
   ```

---

### 2. Ein neues Buch zum Leseplan hinzufügen
1. Lade das Buchcover in Cloudflare R2 unter `books/<jahr>/<dateiname>.png` hoch.
2. Öffne [`library.ts`](./library.ts) und füge einen Eintrag hinzu:
   ```ts
   {
     title: 'Neues Buch',
     author: 'Autor Name',
     cover: getR2Url('books/2026-27/mein-cover.png'),
     href: 'https://kitapdunyasi.eu/products/...'
   }
   ```

---

### 3. Einen neuen Ort / Restaurant im Städte-Guide ergänzen
1. Öffne [`cityGuides.ts`](./cityGuides.ts).
2. Füge den Namen oder den Google Maps Link in das entsprechende Array ein (`hamburgFood`, `hamburgStops`, `frankfurtStops` etc.).

---

## ☁️ Cloudflare R2 & Dateipfade
- Alle R2-URLs werden über die Hilfsfunktion `getR2Url('files/...')` oder `getR2Url('books/...')` generiert.
- Dadurch wird das Streaming, HTTP-Range-Requests und PDF-Vorschauen automatisch über den Server-Proxy `/api/sohbets/stream` abgewickelt.
