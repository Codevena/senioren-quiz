# 🎯 Senior Quiz - Barrierefreies Deutschland-Quiz

Ein barrierefreies Allgemeinwissen/Deutschland-Quiz speziell für Senior*innen mit großer Schrift, hohem Kontrast und einfacher Bedienung.

## ✨ Features

- **🤖 Auto-Play-Modus**: Vollautomatischer Ablauf - Timer startet, Antwort wird aufgedeckt, automatische Weiterleitung
- **⚙️ Anpassbare Einstellungen**:
  - Timer-Dauer (10-30 Sekunden in 5-Sekunden-Schritten)
  - Interaktive Antworten (optional anklickbar während Timer läuft)
  - Fragenkategorien auswählbar
- **🔤 Scrambled Letters**: Neue Kategorie zum Buchstaben-Entwirren
- **♿ Barrierefrei**: Große Schrift (72-96px), hoher Kontrast, Fokus-Ringe
- **📴 Offline-First**: Funktioniert komplett ohne Internet
- **🎨 Modernes Design**: Glassmorphism, Gradients, Glow-Effekte, smooth Animationen
- **🎯 1400+ Fragen**: Deutschland/Allgemeinwissen + Scrambled Letters
- **🎨 Lucide Icons**: Professionelle Icons
- **🎵 Sound-Effekte**: Success & Failure Sounds
- **💡 Fun Facts**: Interessante Zusatzinformationen nach jeder Frage
- **📂 15 Kategorien**: Deutschland, Geografie, Geschichte, Kultur, Politik, Allgemeinwissen, Natur, Sport, Musik, Literatur, Wissenschaft, Tiere, Lebensmittel, Europa, Scrambled Letters

## 🚀 Quick Start

### Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung läuft dann auf `http://localhost:3000`

### Verwendung

1. **Startseite öffnen**: `http://localhost:3000`
2. **Einstellungen konfigurieren**: Klick auf "Einstellungen"
   - Timer-Dauer wählen (10-30 Sekunden)
   - Interaktive Antworten aktivieren/deaktivieren
   - Gewünschte Fragenkategorien auswählen
3. **Quiz starten**: Klick auf "Quiz Starten"
4. **Quiz läuft automatisch**:
   - Timer startet automatisch
   - Antwort wird nach Ablauf aufgedeckt
   - Nach 7 Sekunden automatisch zur nächsten Frage
   - Optional: Antworten während Timer anklicken (wenn aktiviert)

## ⌨️ Tastenkürzel (Presenter-Ansicht)

| Taste | Funktion |
|-------|----------|
| `A` / `B` / `C` / `D` | Antwort auswählen und sofort auswerten |
| `Space` | Timer starten/pausieren/fortsetzen |
| `Enter` | Nächste Frage |
| `←` / `Backspace` | Vorherige Frage |
| `R` | Timer zurücksetzen und neu starten |
| `S` | Lösung sofort zeigen (Skip) |

## 🤖 Automode

Der Automode macht das Quiz komplett automatisch:

1. **Aktivieren**:
   - Auf der Startseite den "Automode" Button auf "AN" stellen
   - Oder in der Presenter-Ansicht aktivieren
2. **Ablauf**:
   - Timer startet automatisch bei jeder Frage
   - Nach 30s wird die Antwort automatisch aufgedeckt (mit Success-Sound)
   - 5 Sekunden Pause zum Besprechen
   - Automatisch zur nächsten Frage
3. **Perfekt für**: Durchlauf ohne Moderator, Warteschleifen, Demos

## 🎵 Sound-Effekte

Das Quiz hat 3 Sound-Effekte:
- **Intro** (`intro.wav`) - Spielt beim Start des Quiz
- **Success** (`success.wav`) - Bei richtiger Antwort oder Auto-Reveal
- **Failure** (`failure.wav`) - Bei falscher Antwort

Sounds liegen in `public/sounds/` und werden automatisch abgespielt.

## 📁 Projektstruktur

```
Quiz/
├── app/
│   ├── api/
│   │   └── quiz/route.ts          # GET /api/quiz - Fragen abrufen (mit Kategorie-Filter)
│   ├── quiz/page.tsx              # Auto-Play Quiz
│   ├── settings/page.tsx          # Einstellungen
│   ├── globals.css                # Globale Styles
│   ├── layout.tsx                 # Root Layout
│   └── page.tsx                   # Startseite (Landing Page)
├── components/
│   ├── QuestionCard.tsx           # Frage-Anzeige
│   ├── Choices.tsx                # Antwort-Buttons (4 Optionen)
│   ├── ResultReveal.tsx           # Ergebnis-Anzeige mit Fun Facts
│   └── TTSSpeaker.tsx             # Text-to-Speech Button
├── lib/
│   ├── questions-data.json        # 1400+ Fragen inkl. Scrambled Letters
│   ├── useTimer.ts                # Timer Hook (konfigurierbar)
│   └── useSounds.ts               # Sound-Effekte Hook
├── sounds/
│   ├── success.wav                # Erfolgs-Sound
│   └── failure.mp3                # Fehler-Sound
├── CHANGES.md                     # Dokumentation der Änderungen
└── README.md
```

## 🗄️ Datenbank

### Schema

```prisma
model QuizQuestion {
  id          String         @id @default(cuid())
  prompt      String         // Frage
  choices     String         // JSON: ["A", "B", "C", "D"]
  answerIndex Int            // 0-3
  fact        String?        // Fun Fact
  tags        String         // JSON: ["Deutschland", "Geografie"]
  difficulty  QuizDifficulty // EASY, MEDIUM, HARD
  createdAt   DateTime       @default(now())
}
```

### Eigene Fragen hinzufügen

Bearbeiten Sie `prisma/seed.ts` und fügen Sie neue Fragen hinzu:

```typescript
{
  prompt: "Ihre Frage hier?",
  choices: JSON.stringify(["Antwort A", "Antwort B", "Antwort C", "Antwort D"]),
  answerIndex: 0, // Index der richtigen Antwort (0-3)
  fact: "Interessanter Fakt zur Frage",
  tags: JSON.stringify(["Deutschland", "Geschichte"]),
  difficulty: QuizDifficulty.EASY,
}
```

Dann neu seeden:

```bash
npm run db:seed
```

## ♿ Barrierefreiheit

### Implementierte Features

- ✅ **Große Schrift**: H1 ≥ 72-96px, Buttons ≥ 80×80px
- ✅ **Hoher Kontrast**: WCAG AA konform
- ✅ **Fokus-Ringe**: 4px gelbe Outline bei Fokus
- ✅ **Tastatur-Navigation**: Vollständig ohne Maus bedienbar
- ✅ **Text-to-Speech**: Vorlesen von Fragen und Antworten
- ✅ **Klare Farbcodierung**: 
  - 🟢 Grün = Richtig
  - 🔴 Rot = Falsch
  - 🟡 Gelb = Ausgewählt
  - 🔵 Blau = Neutral
- ✅ **Große Touch-Targets**: Mindestens 80×80px
- ✅ **Sanfte Animationen**: Keine hektischen Bewegungen

### Accessibility Checklist

- [x] Schriftgröße ≥ 72px für Hauptinhalte
- [x] Kontrastverhältnis ≥ 4.5:1 (WCAG AA)
- [x] Fokus-Indikatoren sichtbar
- [x] Tastatur-Navigation vollständig
- [x] Semantisches HTML
- [x] ARIA-Labels wo nötig
- [x] TTS-Unterstützung
- [x] Keine Zeitlimits ohne Pause-Option
- [x] Große, klare Buttons

## 🎨 Anpassungen

### Timer-Dauer ändern

Über die Einstellungsseite (`/settings`) kann die Timer-Dauer zwischen 10 und 30 Sekunden in 5-Sekunden-Schritten eingestellt werden. Die Einstellung wird automatisch in `localStorage` gespeichert.

### Kategorien anpassen

In `app/settings/page.tsx` können neue Kategorien hinzugefügt werden:

```typescript
const CATEGORIES = [
  'Deutschland',
  'Geografie',
  // ... weitere Kategorien
  'Deine neue Kategorie'
];
```

### Farben anpassen

In `tailwind.config.ts`:

```typescript
colors: {
  'quiz-bg': '#1a1a1a',        // Hintergrund
  'quiz-text': '#ffffff',       // Text
  'quiz-correct': '#22c55e',    // Richtig (Grün)
  'quiz-wrong': '#ef4444',      // Falsch (Rot)
  'quiz-neutral': '#3b82f6',    // Neutral (Blau)
  'quiz-highlight': '#fbbf24',  // Highlight (Gelb)
}
```

## 🔧 Technologie-Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Datenbank**: SQLite + Prisma ORM
- **State Sync**: BroadcastChannel API
- **TTS**: Web Speech API
- **Timer**: requestAnimationFrame (< 200ms Drift)

## 📴 Offline-Nutzung

Die Anwendung funktioniert komplett offline:

1. Einmalig mit Internet: `npm install` und `npm run db:seed`
2. Danach: `npm run dev` funktioniert ohne Internet
3. Alle Fragen sind lokal in SQLite gespeichert
4. Keine externen API-Calls

## 🎯 Workflow für eine Quiz-Session

1. **Vorbereitung**:
   - Laptop mit Presenter-Ansicht öffnen
   - Beamer/TV mit Screen-Ansicht verbinden
   - Beide Fenster nebeneinander positionieren

2. **Start**:
   - In Presenter-Ansicht: `Space` drücken → Timer startet
   - TV zeigt Frage + Timer automatisch

3. **Antwort**:
   - Teilnehmer*innen diskutieren
   - Moderator drückt `A`, `B`, `C` oder `D`
   - Oder: Timer läuft ab → Auto-Reveal

4. **Ergebnis**:
   - Richtige Antwort wird grün markiert
   - Fun Fact wird angezeigt
   - 5-10 Sekunden Zeit zum Besprechen

5. **Weiter**:
   - `Enter` drücken → Nächste Frage
   - Timer automatisch zurückgesetzt

## 🐛 Troubleshooting

### "Keine Fragen gefunden"
```bash
npm run db:seed
```

### Port 3000 bereits belegt
Next.js wählt automatisch einen freien Port (z.B. 3002)

### TTS funktioniert nicht
- Web Speech API wird nicht von allen Browsern unterstützt
- Funktioniert in: Chrome, Edge, Safari
- Funktioniert NICHT in: Firefox (noch nicht)

### Timer läuft nicht synchron
- BroadcastChannel funktioniert nur im gleichen Browser
- Beide Tabs müssen im selben Browser-Fenster sein
- Bei Problemen: Beide Tabs neu laden

## 📝 Scripts

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Production Build
npm run start        # Production Server
npm run db:generate  # Prisma Client generieren
npm run db:push      # Datenbank-Schema pushen
npm run db:seed      # Datenbank mit Fragen füllen
npm run db:studio    # Prisma Studio öffnen
```

## 📄 Lizenz

MIT

## 👥 Für wen ist das?

- Seniorenheime und Altenheime
- Mehrgenerationenhäuser
- Familienfeiern
- Bildungseinrichtungen
- Alle, die ein barrierefreies Quiz brauchen

## 🙏 Danke

Entwickelt mit ❤️ für Senior*innen und ihre Betreuer*innen.

