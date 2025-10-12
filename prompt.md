P — Purpose / Problem / Persona

Ziel: Baue ein barrierearmes Allgemeinwissen/Deutschland-Quiz für Senior*innen (30 Personen) mit 30-Sekunden-Countdown, Antwortwahl per Buchstabe (A/B/C/D) und automatischer Auflösung nach Ablauf der Zeit.
Kontext: Moderator (meine Mutter) steuert am Laptop; Ausgabe auf TV/Beamer. Muss offline funktionieren, optional Voting via QR möglich.

⸻

R — Role / Requirements / Resources

Du bist Senior Full-Stack-Dev. Implementiere mit Next.js 15 (App Router) + TypeScript (strict) + Tailwind und Prisma + SQLite (offline first).
Ressourcen/Libs:
	•	Prisma/SQLite, optional Socket.io (Voting), Web Speech API (TTS) falls vorhanden.
	•	Keine externen Paid-APIs.

Funktionen (MVP):
	1.	Frageansicht (TV): Frage + 3–4 Optionen (A/B/C/D), riesige Schrift, hoher Kontrast.
	2.	Timer 30s: Große, zentrale Ziffern; Progress-Ring/Balken; akustisches Signal am Ende (optional).
	3.	Auto-Reveal: Nach 30s wird automatisch die richtige Antwort farblich hervorgehoben + optional 1-Satz-Fun-Fact.
	4.	Manuelle Auswahl: Presenter drückt A/B/C/D → Antwort wird sofort ausgewertet; Timer stoppt; richtige Lösung wird markiert.
	5.	Navigation & Shortcuts:
	•	Enter: Nächste Frage
	•	Backspace/←: Zurück
	•	Space: Pause/Resume Timer
	•	R: Timer neu starten (30s)
	•	A/B/C/D: Antwort verriegeln
	•	S: Lösung sofort zeigen (Skip)
	6.	Optional Voting: QR zur /vote/[code]; Gäste tippen A–D; Mehrheitsantwort wird live angezeigt. Fallback: Voting-UI ausblenden, wenn Socket nicht aktiv.
	7.	Barrierefreiheit: H1 ≥ 72–96px, Buttons ≥ 80×80px, Fokus-Ringe, hoher Kontrast, TTS-Button (Prompt + richtige Antwort vorlesen).
	8.	Offline-First: Kernfluss ohne Internet voll nutzbar.

⸻

O — Output / Deliverables

Routen:
	•	/presenter/quiz (Steuerpult mit Timer-Kontrollen & Shortcuts)
	•	/screen/quiz (TV-Ansicht nur Inhalt + Countdown)
	•	/vote/[code] (optional, A–D-Voting)

API/Actions:
	•	GET /api/quiz?limit=&tags=&difficulty=
	•	POST /api/session → Voting-Session mit code
	•	Socket-Events (optional): session:join, vote:cast, vote:reset, timer:start|pause|reset, question:next|prev, answer:lock, reveal:auto|force

Komponenten:
	•	BigTimer, QuestionCard, Choices, ResultReveal, PresenterToolbar, QRCodePanel, TTSSpeaker, VoteBar

README: Setup, Tastenkürzel, Offline-Hinweise, Accessibility-Checkliste.
Tests: Unit (Timer-Logik, Normalisierung), e2e (Fragefluss, Auto-Reveal).

⸻

M — Method / Milestones
	1.	Prisma-Schema + Seed (50–100 Fragen, Tags: Deutschland, Allgemeinwissen, leicht).
	2.	Timer-Engine: präzise 30s, Pause/Resume, Reset; Auto-Reveal-Callback.
	3.	Screen-UI: große Typo, klare A–D-Karten, Fortschrittsanzeige.
	4.	Presenter-UI: Shortcuts, sichtbarer Status (laufend/pausiert), „Reveal jetzt“.
	5.	Antwort-Lock & Reveal: manuell (A–D) und automatisch (Timeout).
	6.	Optional Voting (Socket.io) mit Mehrheitsvisualisierung.
	7.	QA & Accessibility-Pass.

⸻

P — Parameters / Constraints
	•	Tech: Next.js 15, TS strict, Tailwind, Prisma + SQLite; keine Netzpflicht.
	•	UX/Barrierefreiheit: Kontrast ≥ WCAG AA, Fokus sichtbar, TTS fallback-safe.
	•	Robustheit: Umlaute/Diakritika handhaben; keine PII; Voting mit simplem Rate-Limit.
	•	Timer-Genauigkeit: Drift < 200ms/30s; Single-Source-of-Truth im Presenter, Screen via Events syncen.

Prisma-Modelle:

model QuizQuestion {
  id          String   @id @default(cuid())
  prompt      String
  choices     String[] // 3–4 Optionen
  answerIndex Int      // 0..3
  fact        String?  // optionaler 1-Satz-Fact
  tags        String[] @default([]) // ["Deutschland","Allgemeinwissen"]
  difficulty  QuizDifficulty @default(EASY)
  createdAt   DateTime @default(now())
}

enum QuizDifficulty { EASY MEDIUM HARD }

model Session {
  id        String   @id @default(cuid())
  code      String   @unique
  createdAt DateTime @default(now())
}

Seed-Schema (JSON):

{
  "prompt": "Wie heißt die Hauptstadt Deutschlands?",
  "choices": ["Berlin","München","Hamburg","Bonn"],
  "answerIndex": 0,
  "fact": "Berlin ist seit 1990 Hauptstadt.",
  "tags": ["Deutschland","Allgemeinwissen"],
  "difficulty": "EASY"
}


⸻

T — Tests / Trace / Triumph (Akzeptanzkriterien)

Muss:
	•	npm run db:seed → /presenter/quiz steuert /screen/quiz offline.
	•	Timer startet bei 30s, Auto-Reveal markiert richtige Antwort farblich + Fact.
	•	Tasten A/B/C/D, Space, Enter, R, ← funktionieren stabil.
	•	Schrift/Buttons aus 3–4 m klar lesbar.
	•	Keine Crashs bei Umlauten und langen Fragen.

Unit-Tests:
	•	Timer: Start/Pause/Resume/Reset; Auto-Reveal feuert exakt einmal.
	•	Antwortcheck: Valid indices, keine Out-of-Bounds.
	•	API: GET /api/quiz?limit=5 liefert 5 Items.

e2e:
	•	3 Fragen durchspielen: manuelle Antwort → sofortige Auswertung; Timeout → Auto-Reveal; Enter → nächste Frage.

⸻

Beispiel-Seed (10 Fragen, DE-fokussiert)

[
  {"prompt":"Wie heißt die Hauptstadt Deutschlands?","choices":["Berlin","München","Hamburg","Bonn"],"answerIndex":0,"fact":"Seit 1990 wieder Hauptstadt.","tags":["Deutschland"],"difficulty":"EASY"},
  {"prompt":"Welche Farben hat die deutsche Flagge?","choices":["Schwarz-Rot-Gold","Schwarz-Gold-Rot","Rot-Schwarz-Gold"],"answerIndex":0,"fact":"Horizontale Streifen.","tags":["Deutschland"],"difficulty":"EASY"},
  {"prompt":"Welcher Fluss fließt durch Köln?","choices":["Rhein","Elbe","Weser","Main"],"answerIndex":0,"fact":"Längster Fluss innerhalb DE ist der Rhein.","tags":["Geografie"],"difficulty":"EASY"},
  {"prompt":"Wofür ist München weltbekannt im Herbst?","choices":["Oktoberfest","Karneval","Documenta"],"answerIndex":0,"fact":"Größtes Volksfest der Welt.","tags":["Kultur"],"difficulty":"EASY"},
  {"prompt":"Wann ist der Tag der Deutschen Einheit?","choices":["3. Oktober","9. November","1. Mai","17. Juni"],"answerIndex":0,"fact":"Seit 1990 gesetzlicher Feiertag.","tags":["Geschichte"],"difficulty":"EASY"},
  {"prompt":"Wie viele Bundesländer hat Deutschland?","choices":["16","14","18","12"],"answerIndex":0,"fact":"Davon 3 Stadtstaaten.","tags":["Politik"],"difficulty":"EASY"},
  {"prompt":"Wo steht das Brandenburger Tor?","choices":["Berlin","Potsdam","Leipzig"],"answerIndex":0,"fact":"Am Pariser Platz.","tags":["Sehenswürdigkeiten"],"difficulty":"EASY"},
  {"prompt":"Wer komponierte die 9. Sinfonie („Ode an die Freude“)?","choices":["Ludwig van Beethoven","Johann Sebastian Bach","Wolfgang Amadeus Mozart"],"answerIndex":0,"fact":"Beethoven wurde in Bonn geboren.","tags":["Kultur"],"difficulty":"MEDIUM"},
  {"prompt":"Welches Meer liegt an der deutschen Nordküste?","choices":["Nordsee","Ostsee","Ärmelkanal"],"answerIndex":0,"fact":"Deutschland hat Nord- und Ostseeküste.","tags":["Geografie"],"difficulty":"EASY"},
  {"prompt":"Welche Währung wurde 2002 als Bargeld eingeführt?","choices":["Euro","D-Mark","Schilling"],"answerIndex":0,"fact":"Der Euro ist seit 1999 Buchgeld, 2002 Bargeld.","tags":["Zeitgeschichte"],"difficulty":"EASY"}
]
]


⸻

Kleine UX-Extras
	•	Sanfter Reveal: Korrekte Karte „pulsiert“ kurz, dann bleibt sie markiert.
	•	Nach Reveal nicht auto-weiter: Lass 5–10 Sek. Zeit zum Plaudern; Enter → nächste Frage.
	•	„Langsam-Modus“: Toggle auf 45 Sek.
	•	Teams & Punkte: Optional +1 für Team A/B; große Punktanzeige oben.

