# Claude – Projektwissen Datenimport

## Wo finde ich was?

| Dokument | Inhalt |
|---|---|
| `prd.md` | Ziel, Scope, Datenmodell, Methoden-Beschreibungen, Technologie-Stack |
| `plan.md` | Implementierungsplan, Entscheidungen, offene Punkte, Iterationshistorie |
| `.claude/plans/humble-seeking-platypus.md` | Detaillierter technischer Plan (Wizard-Flows, Spalten-Mappings, Projektstruktur, State) |

## Projekt-Kurzübersicht

**Zweck:** Interaktive Simulation für Nutzertests zum Import von Weiterbildungshistorien.
Testnutzer durchlaufen 3 Import-Methoden und geben Feedback.

**Stack:** Vue 3 + Vite + Tailwind CSS v3 + Pinia (persistedstate) + Vue Router 4 + lucide-vue-next

**Dev-Server starten:**
```bash
export PATH="/Users/enricoreinsdorf/.nvm/versions/node/v25.5.0/bin:/usr/bin:/bin:$PATH"
npm run dev   # http://localhost:5173
```
Der Preview-Server läuft über `.claude/launch.json` mit absolutem Node-Pfad.

## Schlüssel-Dateien

```
src/
├── views/           HomeView, Methode1-3View, ErgebnisView
├── steps/           Wizard-Schritte je Methode (methode1/, methode2/, methode3/)
├── components/
│   ├── layout/      AppLayout, AppHeader
│   └── shared/      WizardStepper, ReviewTable, ColumnMappingPanel,
│                    ImportConfirmationPanel, ImportResultPanel,
│                    FeedbackForm, FileDropzone, ProcessingAnimation,
│                    StarRating, MethodCard
├── stores/          useImportStore.js, useFeedbackStore.js
├── composables/     useWizard.js, useFileUpload.js, useMarkdownExport.js
├── mock/            existingEmployees.json, trainingData1-3.json,
│                    columnMapping2.json, columnMapping3.json
└── lib/utils.js     cn() Tailwind-Helper
```

## Wichtige Konventionen

- **Keine echten Daten** – alles ist Mock-Simulation
- **shadcn-Komponenten** sind manuell in `src/components/ui/` geschrieben (kein CLI)
- **Stores** sind Pinia mit `persist: true` → localStorage
- **Wizard-State** liegt im `useImportStore`, pro Methode in `methode1/2/3`
- **Feedback** liegt im `useFeedbackStore`
- Nach Feedback-Abgabe wird der Methode-State zurückgesetzt (`resetMethode(n)`)
- **Import abbrechen** → Bestätigungs-Dialog → `resetMethode` + zurück zur Startseite

## Simulationsdateien (public/assets/)

| Datei | Verwendung |
|---|---|
| `excel-vorlage-weiterbildung.xlsx` | Methode 1: Download-Vorlage |
| `excel-import-weiterbildung.xlsx` | Methode 2: Beispiel-Upload |
| `scan-weiterbildung.jpg` | Methode 3: Beispiel-Bild |
| `scan-weiterbildung.pdf` | Methode 3: Beispiel-PDF |

Diese Dateien müssen noch in `public/assets/` erzeugt werden (offener Punkt).
