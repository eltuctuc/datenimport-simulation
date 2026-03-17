# Implementierungsplan – Datenimport-Simulation

## Status: In Entwicklung (Iteration 1)

---

## Abgeschlossen ✅

### Setup
- [x] Vite + Vue 3 Projekt manuell aufgesetzt (kein `create-vite` wegen nicht-leerem Verzeichnis)
- [x] `npm install` – alle Dependencies installiert
- [x] Tailwind CSS v3 + PostCSS konfiguriert
- [x] shadcn-vue Komponenten manuell geschrieben (kein interaktives CLI):
  Button, Card, Badge, Progress, Alert, Separator, Textarea, Select, Checkbox, Dialog
- [x] `src/lib/utils.js` – `cn()` Helper
- [x] `jsconfig.json` – `@/` Alias
- [x] `components.json` – shadcn-vue Konfiguration
- [x] `.claude/launch.json` – Node-Pfad absolut (nvm-Problem gelöst)

### Daten & State
- [x] `existingEmployees.json` – 10 Mitarbeiter (MA-10001…MA-10010)
- [x] `trainingData1.json` – 15 Einträge (Methode 1, sauber)
- [x] `trainingData2.json` – 100 Einträge (Methode 2, informelle Spaltennamen)
- [x] `trainingData3.json` – 50 Einträge (Methode 3, OCR-Artefakte)
- [x] `columnMapping2.json` – Spalten-Mapping für Custom-Excel
- [x] `columnMapping3.json` – Spalten-Mapping für OCR (mit aiSuggestion-Flag)
- [x] `useImportStore.js` – Pinia Store, persistedstate, pro Methode state
- [x] `useFeedbackStore.js` – Pinia Store, persistedstate

### Composables
- [x] `useWizard.js` – Wizard-Logik (next, goTo, setFile, setMappings, ...)
- [x] `useFileUpload.js` – Drag & Drop + Input
- [x] `useMarkdownExport.js` – Markdown generieren + als Datei herunterladen

### Layout & Routing
- [x] `AppLayout.vue` + `AppHeader.vue`
- [x] `router/index.js` – Routes für /, /methode/1-3, /ergebnis

### Basis-Komponenten
- [x] `WizardStepper.vue` – Schritt-Anzeige mit Check-Icons
- [x] `FileDropzone.vue` – Drag & Drop Datei-Upload
- [x] `ProcessingAnimation.vue` – Fortschrittsanzeige mit Steps
- [x] `StarRating.vue` – 1–5 Sterne, readonly + interaktiv
- [x] `MethodCard.vue` – Methode-Karte auf Startseite

### Kern-Komponenten
- [x] `ColumnMappingPanel.vue` – Spalten-Zuordnung (Methode 2 + 3)
- [x] `ReviewTable.vue` – Datentabelle mit Checkboxes, Dropdowns, Paginierung
- [x] `ImportConfirmationPanel.vue` – Bestätigungsschritt vor Import
- [x] `ImportResultPanel.vue` – Ergebnis mit Warnings/Errors (aufklappbar)
- [x] `FeedbackForm.vue` – 3 Dimensionen Sterne + Freitext

### Views & Steps
- [x] `HomeView.vue` – Startseite mit 3 Methode-Karten + Fortschritt
- [x] `ErgebnisView.vue` – Auswertung, Feedback-Vergleich, Markdown-Export, Reset
- [x] Methode 1: Step1Explanation, Step2Upload, Step3Review, Step4Confirmation, Step5ImportResult, Step6Feedback
- [x] Methode 2: Step1Upload, Step2Mapping, Step3Review, Step4Confirmation, Step5ImportResult, Step6Feedback
- [x] Methode 3: Step1Upload, Step2AiAnalysis, Step3Mapping, Step4Review, Step5Confirmation, Step6ImportResult, Step7Feedback

### Dokumentation
- [x] `prd.md` – Produktanforderungen
- [x] `plan.md` – dieser Plan
- [x] `CLAUDE.md` – Projektübersicht für Claude

---

## Abgeschlossen (Iteration 2) ✅

### Bugfixes & Verbesserungen
- [x] Auswertung: Importierte-Datensätze-Tabelle entfernt (nur Feedback relevant)
- [x] State-Isolation: Methode-Reset beim Klick auf "Starten"/"Erneut starten" (importStore.resetMethode + feedbackStore.resetMethode)
- [x] ColumnMappingPanel: Badge wechselt "Nicht erkannt" → "Manuell zugeordnet" (grün) nach manueller Zuordnung
- [x] 3 Scan-Bilder generiert: `scan-weiterbildung-1.jpg`, `-2.jpg`, `-3.jpg` (je ~20 Zeilen, verschiedene Rotationen)
- [x] 3-seitiges PDF generiert: `scan-weiterbildung.pdf` (korrekte PDF-Struktur mit 3 Pages-Objekten)
- [x] Methode 3 Step1Upload: Download-Links auf 3 Scan-Bilder + PDF aktualisiert

## Offen ❌

### Verifikation & Bugfixes
- [ ] Kompletten Wizard-Flow (alle 3 Methoden) im Browser durchspielen
- [ ] localStorage-Persistenz über Browser-Refresh prüfen
- [ ] "Import abbrechen" Dialog-Flow testen
- [ ] Paginierung bei 100 Einträgen (Methode 2) prüfen
- [ ] Markdown-Export Inhalt prüfen

---

## Architektur-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| shadcn-Komponenten manuell schreiben | `npx shadcn-vue@latest init` nicht interaktiv bedienbar im Agenten-Kontext |
| `pinia-plugin-persistedstate@3` (nicht v4) | v4 erfordert Pinia v3; v3 ist kompatibel mit Pinia v2 |
| Node-Pfad absolut in launch.json | nvm nicht im System-PATH verfügbar wenn Preview-Server startet |
| Vite-Projekt manuell angelegt | `npm create vite@latest .` scheitert in nicht-leerem Verzeichnis (.claude/) |
| Tailwind v3 (nicht v4) | Bessere Kompatibilität mit shadcn-vue und bewährterer Konfig-Ansatz |
| Mock-Daten lazy-loaded bei Methode 2+3 | trainingData2 (100 Einträge) und trainingData3 (50 Einträge) per `import()` |

---

## Nächste Iteration

1. Simulationsdateien (`public/assets/`) erstellen
2. Vollständiger Testdurchlauf aller 3 Methoden
3. UI-Polish nach erstem Testdurchlauf
4. Ggf. weitere Methoden ergänzen (z.B. API-Import, Copy-Paste aus Tabelle)
