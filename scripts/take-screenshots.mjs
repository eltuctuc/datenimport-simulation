/**
 * Nimmt Screenshots aller wichtigen App-Ansichten auf.
 * Aufruf: node scripts/take-screenshots.mjs
 * Voraussetzung: Dev-Server läuft auf localhost:5173
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dir, '..', 'public', 'screenshots')
mkdirSync(OUT, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5173'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  defaultViewport: { width: 1280, height: 900 },
})

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function shot(page, filename) {
  await sleep(600)
  await page.screenshot({ path: join(OUT, filename), type: 'png', fullPage: false })
  console.log(`✅ ${filename}`)
}

async function setLS(page, imp, fb) {
  await page.evaluate((imp, fb) => {
    if (imp) localStorage.setItem('import', JSON.stringify(imp))
    if (fb)  localStorage.setItem('feedback', JSON.stringify(fb))
  }, imp, fb)
}

const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })

const baseFb = { methode1: null, methode2: null, methode3: null, comparativeFeedback: null }
const baseImp = {
  methode1: { currentStep: 1, uploadedFileName: null, columnMappings: {}, selectedRecordIds: [], dropdownCorrections: {}, importResult: null, completed: false },
  methode2: { currentStep: 1, uploadedFileName: null, columnMappings: {}, selectedRecordIds: [], dropdownCorrections: {}, importResult: null, completed: false },
  methode3: { currentStep: 1, uploadedFileName: null, columnMappings: {}, selectedRecordIds: [], dropdownCorrections: {}, importResult: null, completed: false },
  importedRecords: []
}

// ── 1. Dashboard ──────────────────────────────────────────────────────────────
await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
await setLS(page, {
  ...baseImp,
  methode1: { ...baseImp.methode1, currentStep: 6, uploadedFileName: 'excel-vorlage-weiterbildung.xlsx', completed: true, importResult: { imported: 13, warnings: 2, errors: 0, skipped: 0 } },
}, {
  ...baseFb,
  methode1: { einfachheit: 5, praxisnaehe: 4, neuartigkeit: 2, anmerkungen: 'Sehr intuitiv!', submittedAt: '2026-03-17T10:00:00Z' },
})
await page.reload({ waitUntil: 'networkidle0' })
await shot(page, '01-dashboard.png')

// ── 2. Methode 1 / Daten prüfen ───────────────────────────────────────────────
await setLS(page, {
  ...baseImp,
  methode1: { currentStep: 3, uploadedFileName: 'excel-vorlage-weiterbildung.xlsx', columnMappings: {}, selectedRecordIds: [], dropdownCorrections: {}, importResult: null, completed: false },
}, null)
await page.goto(BASE + '/methode/1', { waitUntil: 'networkidle0' })
await shot(page, '02-methode1-daten-pruefen.png')

// ── 3. Methode 2 / Upload ─────────────────────────────────────────────────────
await setLS(page, {
  ...baseImp,
  methode2: { ...baseImp.methode2, currentStep: 1 },
}, null)
await page.goto(BASE + '/methode/2', { waitUntil: 'networkidle0' })
await shot(page, '03-methode2-upload.png')

// ── 4. Methode 2 / Spaltenzuordnung ──────────────────────────────────────────
await setLS(page, {
  ...baseImp,
  methode2: { currentStep: 2, uploadedFileName: 'excel-import-weiterbildung.xlsx', columnMappings: {}, selectedRecordIds: [], dropdownCorrections: {}, importResult: null, completed: false },
}, null)
await page.reload({ waitUntil: 'networkidle0' })
await shot(page, '04-methode2-spaltenzuordnung.png')

// ── 5. Methode 3 / Feedback befüllt ──────────────────────────────────────────
await setLS(page, {
  ...baseImp,
  methode3: { currentStep: 7, uploadedFileName: 'scan-weiterbildung-1.jpg', columnMappings: {}, selectedRecordIds: [], dropdownCorrections: {}, importResult: { imported: 45, warnings: 4, errors: 1, skipped: 0 }, completed: true },
}, null)
await page.goto(BASE + '/methode/3', { waitUntil: 'networkidle0' })
await sleep(300)
// Fill star ratings via click
await page.evaluate(() => {
  const groups = document.querySelectorAll('.flex.gap-1')
  const ratings = [4, 3, 5]
  groups.forEach((g, i) => {
    if (i >= ratings.length) return
    const btns = g.querySelectorAll('button')
    if (btns[ratings[i] - 1]) btns[ratings[i] - 1].click()
  })
  const ta = document.querySelector('textarea')
  if (ta) {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, 'Faszinierend — der KI-Ansatz spart enorm viel Zeit.')
    ta.dispatchEvent(new Event('input', { bubbles: true }))
  }
})
await sleep(300)
await shot(page, '05-methode3-feedback.png')

// ── 6. Auswertung mit Ergebnissen ────────────────────────────────────────────
await setLS(page, baseImp, {
  methode1: { einfachheit: 5, praxisnaehe: 4, neuartigkeit: 2, anmerkungen: 'Sehr strukturiert — ich kenne mich mit Excel aus, das war einfach.', submittedAt: '2026-03-17T10:30:00Z' },
  methode2: { einfachheit: 3, praxisnaehe: 4, neuartigkeit: 3, anmerkungen: 'Die automatische Spaltenerkennung hat gut funktioniert.', submittedAt: '2026-03-17T11:00:00Z' },
  methode3: { einfachheit: 4, praxisnaehe: 3, neuartigkeit: 5, anmerkungen: 'Faszinierend — der KI-Ansatz spart enorm viel Zeit beim Datenerfassen.', submittedAt: '2026-03-17T11:45:00Z' },
  comparativeFeedback: { bevorzugteMethode: 1, begruendung: 'Am vertrautesten und am schnellsten für meinen Alltag.', submittedAt: '2026-03-17T12:00:00Z' },
})
await page.goto(BASE + '/ergebnis', { waitUntil: 'networkidle0' })
await shot(page, '06-auswertung.png')

await browser.close()
console.log(`\n✓ Alle Screenshots in public/screenshots/`)
