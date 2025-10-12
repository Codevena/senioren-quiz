# 🚀 Quick Start Guide

## Installation (5 Minuten)

```bash
# 1. Dependencies installieren
npm install

# 2. Datenbank initialisieren
npm run db:push

# 3. Fragen in Datenbank laden (30 Deutschland-Fragen)
npm run db:seed

# 4. Server starten
npm run dev
```

## Verwendung

### Setup für Quiz-Session

1. **Browser öffnen**: `http://localhost:3000` (oder der angezeigte Port)

2. **Zwei Fenster öffnen**:
   - **Fenster 1** (Laptop): Klick auf "🎮 Presenter-Ansicht"
   - **Fenster 2** (Beamer/TV): Klick auf "📺 TV-Ansicht"

3. **Fenster positionieren**:
   - Presenter-Ansicht auf Laptop-Bildschirm
   - TV-Ansicht auf zweiten Bildschirm ziehen (Vollbild: F11)

### Quiz durchführen

1. **Start**: In Presenter-Ansicht `Space` drücken → Timer startet
2. **Antwort**: Taste `A`, `B`, `C` oder `D` drücken → Sofortige Auswertung
3. **Weiter**: `Enter` drücken → Nächste Frage
4. **Zurück**: `←` oder `Backspace` → Vorherige Frage

### Alle Tastenkürzel

| Taste | Funktion |
|-------|----------|
| `Space` | Timer starten/pausieren |
| `A` `B` `C` `D` | Antwort auswählen |
| `Enter` | Nächste Frage |
| `←` / `Backspace` | Vorherige Frage |
| `R` | Timer zurücksetzen |
| `S` | Lösung sofort zeigen |

## Features

✅ **30 Deutschland-Fragen** vorinstalliert  
✅ **30-Sekunden-Timer** mit Auto-Reveal  
✅ **Große Schrift** (72-96px) für bessere Lesbarkeit  
✅ **Hoher Kontrast** (WCAG AA)  
✅ **Text-to-Speech** (Vorlesen-Button)  
✅ **Team-Scoring** (optional)  
✅ **Offline-fähig** (keine Internet-Verbindung nötig)  
✅ **Tastatur-Steuerung** (komplett ohne Maus)

## Troubleshooting

### "Keine Fragen gefunden"
```bash
npm run db:seed
```

### Port bereits belegt
Next.js wählt automatisch einen freien Port (z.B. 3002 statt 3000)

### TTS funktioniert nicht
- Nur in Chrome, Edge, Safari verfügbar
- Firefox unterstützt Web Speech API noch nicht

### Beide Fenster nicht synchron
- Beide Tabs müssen im **gleichen Browser** sein
- Bei Problemen: Beide Tabs neu laden (F5)

## Eigene Fragen hinzufügen

Bearbeiten Sie `prisma/seed.ts`:

```typescript
{
  prompt: "Ihre Frage?",
  choices: JSON.stringify(["A", "B", "C", "D"]),
  answerIndex: 0, // 0=A, 1=B, 2=C, 3=D
  fact: "Interessanter Fakt",
  tags: JSON.stringify(["Deutschland"]),
  difficulty: QuizDifficulty.EASY,
}
```

Dann:
```bash
npm run db:seed
```

## Tipps für beste Erfahrung

1. **Schriftgröße**: Aus 3-4 Metern gut lesbar
2. **Kontrast**: Dunkler Raum = bessere Sichtbarkeit
3. **Pause**: Nach jeder Antwort 5-10 Sekunden Zeit zum Besprechen
4. **Teams**: Nutzen Sie das Team-Scoring für mehr Spaß
5. **Langsam-Modus**: 45s Timer für mehr Bedenkzeit

## Support

Bei Fragen oder Problemen:
- Siehe vollständiges README.md
- Oder öffnen Sie ein Issue auf GitHub

Viel Spaß beim Quiz! 🎉

