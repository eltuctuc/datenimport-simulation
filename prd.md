# PRD – Datenimport-Simulation

**Projekt:** Datenimport
**Typ:** Interaktive Nutzerstudie (Simulation)
**Stand:** März 2026
**Erstellt für:** AKDB – Interne Nutzertests

---

## Ziel

Ziel dieser Anwendung ist es, **Testnutzern drei verschiedene Methoden zum Import von Weiterbildungshistorien** in ein bestehendes Personalverwaltungssystem vorzustellen und deren Usability zu evaluieren. Die Simulation ermöglicht es, realistische Nutzungsszenarien durchzuspielen, ohne dass echte Daten verarbeitet oder persistiert werden.

Die Ergebnisse sollen Aufschluss geben über:
- Welche Import-Methode von Nutzern bevorzugt wird
- Wie einfach, praxisnah und innovativ die jeweilige Methode wahrgenommen wird
- Welche Reibungspunkte im Prozess auftreten

---

## Hintergrund

Mitarbeiter-Weiterbildungshistorien werden derzeit manuell gepflegt. Um den Datenimport aus verschiedenen Quellen zu ermöglichen, sollen mehrere technische Ansätze evaluiert werden. Da die Implementierung aufwändig ist, soll zunächst durch eine Simulation festgestellt werden, welche Methode die beste Nutzererfahrung bietet.

---

## Zielgruppe

- Sachbearbeiter in HR/Personalwesen
- Verwaltungsmitarbeiter mit grundlegenden PC-Kenntnissen
- Testnutzer aus verschiedenen Abteilungen (IT, Recht, Compliance, Management)

---

## Datenmodell (Zielstruktur)

Das System verwaltet **Weiterbildungshistorien** mit folgendem Kern-Datenmodell:

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `mitarbeiterId` | String | ✓ | Referenz auf bestehenden Mitarbeiter (MA-10001…) |
| `bezeichnung` | String | ✓ | Name der Weiterbildung |
| `startdatum` | String (ISO) | ✓ | Format: YYYY-MM-DD |
| `status` | Enum | ✓ | geplant / abgeschlossen / storniert / in Bearbeitung |
| `seminartyp` | Enum | ✓ | Fachseminar / Workshop / Webinar / Pflichtschulung / E-Learning |
| `seminarart` | Enum | ✓ | Präsenz / Online / Hybrid |
| `seminarbereich` | Enum | ✓ | IT / Recht / Management / Soft Skills / Compliance |
| `veranstalter` | String | ✓ | Name des Veranstalters |
| `enddatum` | String | — | Optional |
| `kosten` | Number | — | In Euro |
| `teilnahmebescheinigung` | Boolean | — | Ob eine Bescheinigung vorhanden ist |
| `notizen` | String | — | Freitext |
| … | … | … | Weitere Optionalfelder lt. Datenmodell |

---

## Die drei Import-Methoden

### Methode 1 – Excel-Vorlage (Download & Re-Upload)

**Ablauf:**
1. Nutzer lädt eine vorgefertigte Excel-Vorlage herunter (Spalten = Felder des Datenmodells)
2. Nutzer befüllt die Vorlage offline in Excel
3. Nutzer lädt die befüllte Datei hoch
4. System erkennt automatisch alle Spalten (Vorlage = 1:1 Datenmodell)
5. Nutzer prüft 15 Datensätze in Tabelle, kann Dropdown-Felder korrigieren, wählt aus
6. Bestätigungsschritt → Importergebnis mit Warnings/Errors → Feedback

**Simulierte Daten:** `trainingData1.json` (15 Einträge, sauber)

---

### Methode 2 – Eigene Excel-Datei (automatisches Spalten-Mapping)

**Ablauf:**
1. Nutzer lädt seine eigene Excel-Datei hoch (beliebige Spaltenstruktur)
2. System analysiert Spalten und schlägt Zuordnungen vor
3. Nutzer korrigiert nicht erkannte Spalten in einer Mapping-Maske
4. Nutzer prüft 100 Datensätze (paginiert), kann Dropdown-Felder korrigieren, wählt aus
5. Bestätigungsschritt → Importergebnis → Feedback

**Simulierte Daten:** `trainingData2.json` (100 Einträge, informelle Spaltennamen)
**Mapping-Vorlage:** `columnMapping2.json`

---

### Methode 3 – Bild / PDF-Scan (KI-gestützte Erkennung)

**Ablauf:**
1. Nutzer lädt ein Foto oder PDF-Scan einer Tabelle hoch
2. KI-Analyse-Animation (simuliert OCR + Spaltenerkennung, ~3 Sekunden)
3. KI schlägt Spalten-Zuordnungen vor (mit KI-Badge markiert)
4. Nutzer prüft 50 Datensätze mit OCR-Artefakten, korrigiert, wählt aus
5. Bestätigungsschritt → Importergebnis → Feedback

**Simulierte Daten:** `trainingData3.json` (50 Einträge, OCR-Artefakte)
**Mapping-Vorlage:** `columnMapping3.json`
**Scan-Dateien (3-seitiges Dokument):**
- `scan-weiterbildung-1.jpg` – Seite 1 (20 Zeilen)
- `scan-weiterbildung-2.jpg` – Seite 2 (20 Zeilen)
- `scan-weiterbildung-3.jpg` – Seite 3 (10 Zeilen)
- `scan-weiterbildung.pdf` – Gesamtes Dokument, 3 Seiten

---

## Feedback-System

### Pro Methode (nach jedem Import)
Drei Dimensionen, je 1–5 Sterne:
- **Einfachheit** – „Wie einfach war diese Methode zu bedienen?"
- **Praxisnähe** – „Wie gut passt diese Methode zu Ihrem Arbeitsalltag?"
- **Neuartigkeit** – „Wie neuartig/zukunftsweisend empfanden Sie diesen Ansatz?"
- **Freitext** – optionale Anmerkungen

### Vergleichendes Fazit (nach allen 3 Methoden)
- Welche Methode wird bevorzugt? (Radio-Auswahl)
- Begründung (Freitext, optional)

### Export
- Auswertungsseite (`/ergebnis`) zeigt ausschließlich Feedback-Daten (keine importierten Datensätze)
- Vergleichende Fazit-Eingabe + Feedback-Karten mit Sterne-Anzeige je Methode
- Markdown-Export der Ergebnisse (Download als `.md`-Datei)

### State-Isolation
- Jede Methode ist vollständig unabhängig von den anderen
- Beim Klick auf "Starten" / "Erneut starten" auf der Startseite wird der komplette State der jeweiligen Methode (importStore + feedbackStore) zurückgesetzt
- Alle 3 Methoden können in beliebiger Reihenfolge und beliebig oft durchlaufen werden

### Spalten-Mapping UX
- Spalten mit Konfidenz "Nicht erkannt" können manuell zugeordnet werden
- Nach manueller Zuordnung wechselt das Badge von "Nicht erkannt" (rot) zu "Manuell zugeordnet" (grün)

---

## Technischer Stack

| Bereich | Technologie |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build-Tool | Vite |
| UI-Komponenten | shadcn-vue (selbst geschrieben, Tailwind-basiert) |
| Styling | Tailwind CSS v3 |
| State | Pinia + pinia-plugin-persistedstate |
| Routing | Vue Router 4 |
| Icons | lucide-vue-next |
| Persistenz | localStorage (via Pinia) |

---

## Nicht-Ziele / Abgrenzung

- **Kein echter Datenimport** – alle Daten sind Simulationen (Mock-JSON)
- **Keine Backend-Anbindung** – vollständig clientseitig
- **Keine Authentifizierung** – die Anwendung ist offen für alle Testnutzer
- **Keine echte OCR/KI** – die KI-Analyse ist eine animierte Simulation
- **Kein echter Excel-Parse** – das System erkennt nur, dass es eine Excel-Datei ist; Daten kommen aus Mock-JSON

---

## Projektstruktur (Kurzübersicht)

```
src/
├── views/           # HomeView, Methode1-3View, ErgebnisView
├── steps/           # Methode 1-3 Wizard-Schritte
├── components/
│   ├── layout/      # AppLayout, AppHeader
│   └── shared/      # WizardStepper, ReviewTable, ColumnMappingPanel,
│                    # ImportConfirmationPanel, ImportResultPanel, FeedbackForm,
│                    # FileDropzone, ProcessingAnimation, StarRating, MethodCard
├── stores/          # useImportStore, useFeedbackStore (Pinia)
├── composables/     # useWizard, useFileUpload, useMarkdownExport
├── mock/            # JSON-Daten (employees, trainingData1-3, columnMappings)
└── lib/utils.js     # cn() Tailwind-Helper
```

---

## Erfolgsmetriken für die Nutzerstudie

1. Nutzer schließen alle 3 Methoden ohne externe Hilfe ab
2. Sterne-Bewertung je Methode (Mittelwert über Testgruppe)
3. Qualitative Anmerkungen aus Freitext-Feldern
4. Bevorzugte Methode (absolute Häufigkeit)
5. Beobachtbare Reibungspunkte (z.B. Abbrüche, Rückfragen)
