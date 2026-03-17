/**
 * Generiert alle Simulations-Dateien für public/assets/:
 *   - excel-vorlage-weiterbildung.xlsx  (Methode 1: leere Vorlage mit 1 Beispielzeile)
 *   - excel-import-weiterbildung.xlsx   (Methode 2: Custom-Excel mit 100 Zeilen)
 *   - scan-weiterbildung-1.jpg           (Methode 3: Bild-Scan Seite 1)
 *   - scan-weiterbildung-2.jpg           (Methode 3: Bild-Scan Seite 2)
 *   - scan-weiterbildung-3.jpg           (Methode 3: Bild-Scan Seite 3)
 *   - scan-weiterbildung.pdf            (Methode 3: PDF-Scan, 3 Seiten)
 *
 * Aufruf: node scripts/generate-assets.mjs
 */

import ExcelJS from 'exceljs'
import { createCanvas } from 'canvas'
import { createWriteStream, mkdirSync } from 'fs'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')
const OUT = join(ROOT, 'public', 'assets')

mkdirSync(OUT, { recursive: true })

// ─── Mock-Daten laden ────────────────────────────────────────────────────────

const data1 = JSON.parse(await readFile(join(ROOT, 'src/mock/trainingData1.json'), 'utf8'))
const data2 = JSON.parse(await readFile(join(ROOT, 'src/mock/trainingData2.json'), 'utf8'))
const data3 = JSON.parse(await readFile(join(ROOT, 'src/mock/trainingData3.json'), 'utf8'))

// ─── EXCEL-VORLAGE (Methode 1) ───────────────────────────────────────────────

async function generateVorlage() {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'AKDB Datenimport-Simulation'
  const ws = wb.addWorksheet('Weiterbildungshistorie')

  const cols = [
    { key: 'mitarbeiterId',         header: 'Mitarbeiter-ID',          width: 16 },
    { key: 'bezeichnung',           header: 'Bezeichnung *',            width: 36 },
    { key: 'zusatzbezeichnung',     header: 'Zusatzbezeichnung',        width: 28 },
    { key: 'startdatum',            header: 'Startdatum * (JJJJ-MM-TT)',width: 22 },
    { key: 'enddatum',              header: 'Enddatum (JJJJ-MM-TT)',    width: 20 },
    { key: 'beginnUhrzeit',         header: 'Beginn-Uhrzeit (HH:MM)',   width: 20 },
    { key: 'endeUhrzeit',           header: 'Ende-Uhrzeit (HH:MM)',     width: 20 },
    { key: 'status',                header: 'Status *',                 width: 18 },
    { key: 'seminartyp',            header: 'Seminartyp *',             width: 18 },
    { key: 'seminarart',            header: 'Seminarart *',             width: 14 },
    { key: 'seminarbereich',        header: 'Seminarbereich *',         width: 16 },
    { key: 'veranstalter',          header: 'Veranstalter *',           width: 28 },
    { key: 'veranstaltungsort',     header: 'Veranstaltungsort',        width: 22 },
    { key: 'externerAnbieter',      header: 'Externer Anbieter',        width: 26 },
    { key: 'istReferent',           header: 'Ich war Referent (ja/nein)',width: 24 },
    { key: 'referent',              header: 'Referent (Name)',          width: 22 },
    { key: 'seminarnummer',         header: 'Seminarnummer',            width: 20 },
    { key: 'kosten',                header: 'Kosten (EUR)',             width: 14 },
    { key: 'teilnahmebescheinigung',header: 'Teilnahmebescheinigung (ja/nein)', width: 30 },
    { key: 'grundStornierung',      header: 'Stornierungsgrund',        width: 28 },
    { key: 'notizen',               header: 'Notizen',                  width: 32 },
  ]

  ws.columns = cols

  // Header-Zeile stylen
  const headerRow = ws.getRow(1)
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
    cell.alignment = { wrapText: true, vertical: 'middle' }
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF1D4ED8' } } }
  })
  headerRow.height = 36

  // Hinweis-Zeile
  const hinweisRow = ws.getRow(2)
  hinweisRow.getCell(1).value = '→ Mit * markierte Felder sind Pflichtfelder'
  hinweisRow.getCell(1).font = { italic: true, color: { argb: 'FF6B7280' }, size: 9 }
  ws.mergeCells('A2:U2')
  hinweisRow.height = 18

  // Beispielzeile (1 Eintrag aus data1)
  const ex = data1[0]
  const exRow = ws.addRow({
    ...ex,
    istReferent: ex.istReferent ? 'ja' : 'nein',
    teilnahmebescheinigung: ex.teilnahmebescheinigung ? 'ja' : 'nein',
  })
  exRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } }
    cell.font = { color: { argb: 'FF6B7280' }, italic: true }
  })

  // Leere Datenzeilen (12 Stück)
  for (let i = 0; i < 12; i++) ws.addRow({})

  // Freeze header
  ws.views = [{ state: 'frozen', ySplit: 2 }]

  await wb.xlsx.writeFile(join(OUT, 'excel-vorlage-weiterbildung.xlsx'))
  console.log('✅ excel-vorlage-weiterbildung.xlsx')
}

// ─── CUSTOM EXCEL (Methode 2) ────────────────────────────────────────────────

async function generateCustomExcel() {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'HR-Export'
  const ws = wb.addWorksheet('Weiterbildungen')

  // Informelle/englische Spaltenstruktur — passend zu columnMapping2.json
  ws.columns = [
    { key: 'vorname',        header: 'Vorname',          width: 14 },
    { key: 'nachname',       header: 'Nachname',         width: 16 },
    { key: 'mitarbeiterId',  header: 'Mitarbeiter-Nr.',  width: 16 },
    { key: 'bezeichnung',    header: 'Seminar',          width: 34 },
    { key: 'startdatum',     header: 'Start',            width: 14 },
    { key: 'enddatum',       header: 'Ende',             width: 14 },
    { key: 'seminartyp',     header: 'Typ',              width: 16 },
    { key: 'seminarart',     header: 'Online/Präsenz',   width: 14 },
    { key: 'seminarbereich', header: 'Bereich',          width: 14 },
    { key: 'veranstalter',   header: 'Veranstalter',     width: 26 },
    { key: 'kosten',         header: 'Kosten',           width: 10 },
    { key: 'bescheinigung',  header: 'Bescheinigung',    width: 16 },
    { key: 'notizen',        header: 'Kommentare',       width: 28 },
  ]

  // Namen-Lookup aus existingEmployees
  const employees = JSON.parse(await readFile(join(ROOT, 'src/mock/existingEmployees.json'), 'utf8'))
  const empMap = Object.fromEntries(employees.map(e => [e.mitarbeiterId, e]))

  const headerRow = ws.getRow(1)
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF374151' } }
  })

  for (const r of data2) {
    const emp = empMap[r.mitarbeiterId] || {}
    ws.addRow({
      vorname: emp.vorname || '',
      nachname: emp.nachname || '',
      mitarbeiterId: r.mitarbeiterId,
      bezeichnung: r.bezeichnung,
      startdatum: r.startdatum,
      enddatum: r.enddatum || '',
      seminartyp: r.seminartyp,
      seminarart: r.seminarart,
      seminarbereich: r.seminarbereich,
      veranstalter: r.veranstalter,
      kosten: r.kosten ?? '',
      bescheinigung: r.teilnahmebescheinigung ? 'Ja' : 'Nein',
      notizen: r.notizen || '',
    })
  }

  ws.views = [{ state: 'frozen', ySplit: 1 }]
  await wb.xlsx.writeFile(join(OUT, 'excel-import-weiterbildung.xlsx'))
  console.log('✅ excel-import-weiterbildung.xlsx')
}

// ─── SCAN-BILDER (Methode 3, 3 Seiten) ──────────────────────────────────────

async function generateScanImages() {
  const employees = JSON.parse(await readFile(join(ROOT, 'src/mock/existingEmployees.json'), 'utf8'))
  const empMap = Object.fromEntries(employees.map(e => [e.mitarbeiterId, e]))

  const PAGE_ROWS = [data3.slice(0, 20), data3.slice(20, 40), data3.slice(40)]
  const colHeaders = ['Vorn.', 'Nachname', 'MitarbNr', 'Schulung', 'Anfang', 'Ende_Dat', 'Art', 'Anbieter', 'Kosten']
  const colWidths =  [70,       90,          80,         240,        90,       90,         70,    160,         70]
  const rowH = 26
  const headerH = 32
  const marginX = 30
  const marginY = 40
  const totalW = colWidths.reduce((a, b) => a + b, 0) + marginX * 2
  const totalCols = colWidths.reduce((a,b)=>a+b,0)

  // Slight rotation per page for variety
  const rotations = [-0.008, 0.005, -0.004]

  for (let pageIdx = 0; pageIdx < PAGE_ROWS.length; pageIdx++) {
    const rows = PAGE_ROWS[pageIdx]
    const pageNum = pageIdx + 1
    const totalH = headerH + rows.length * rowH + marginY * 2 + 60

    const canvas = createCanvas(totalW, totalH)
    const ctx = canvas.getContext('2d')

    // Scan background
    ctx.fillStyle = '#f8f7f5'
    ctx.fillRect(0, 0, totalW, totalH)
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * totalW
      const y = Math.random() * totalH
      const alpha = Math.random() * 0.06
      ctx.fillStyle = `rgba(0,0,0,${alpha})`
      ctx.fillRect(x, y, 1, 1)
    }

    ctx.save()
    ctx.translate(totalW / 2, totalH / 2)
    ctx.rotate(rotations[pageIdx])
    ctx.translate(-totalW / 2, -totalH / 2)

    // Title (only on page 1; other pages show continuation)
    ctx.fillStyle = '#1a1a1a'
    ctx.font = 'bold 15px serif'
    if (pageNum === 1) {
      ctx.fillText('Weiterbildungsnachweis – Abteilung HR / Stand 2024', marginX, marginY - 12)
    } else {
      ctx.fillText(`Weiterbildungsnachweis – Abteilung HR / Stand 2024 (Fortsetzung)`, marginX, marginY - 12)
    }

    // Column headers
    let x = marginX
    ctx.fillStyle = '#2c2c2c'
    ctx.font = 'bold 11px monospace'
    colHeaders.forEach((h, i) => {
      ctx.fillText(h, x + 4, marginY + headerH - 10)
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(x, marginY); ctx.lineTo(x, marginY + headerH + rows.length * rowH); ctx.stroke()
      x += colWidths[i]
    })
    ctx.beginPath(); ctx.moveTo(x, marginY); ctx.lineTo(x, marginY + headerH + rows.length * rowH); ctx.stroke()

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(marginX, marginY + headerH); ctx.lineTo(marginX + totalCols, marginY + headerH); ctx.stroke()

    // Data rows
    ctx.font = '10px monospace'
    rows.forEach((r, ri) => {
      const emp = empMap[r.mitarbeiterId] || {}
      const y = marginY + headerH + ri * rowH

      if (ri % 2 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.03)'
        ctx.fillRect(marginX, y, totalCols, rowH)
      }

      const cells = [
        (emp.vorname || '').substring(0, 4) + '.',
        emp.nachname || '',
        r.mitarbeiterId.replace('MA-', ''),
        (r.bezeichnung || '').substring(0, 28),
        r.startdatum ? r.startdatum.split('-').reverse().join('.').replace(/20(\d\d)$/, '$1') : '',
        r.enddatum ? r.enddatum.split('-').reverse().join('.').replace(/20(\d\d)$/, '$1') : '',
        (r.seminarart || '').substring(0, 8),
        (r.veranstalter || '').substring(0, 18),
        r.kosten != null ? r.kosten.toFixed(0) : '',
      ]

      ctx.fillStyle = '#1a1a1a'
      let cx = marginX
      cells.forEach((cell, ci) => {
        ctx.fillText(String(cell), cx + 4, y + rowH - 8)
        cx += colWidths[ci]
      })

      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(marginX, y + rowH); ctx.lineTo(marginX + totalCols, y + rowH); ctx.stroke()
    })

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1.5
    ctx.strokeRect(marginX, marginY, totalCols, headerH + rows.length * rowH)

    ctx.fillStyle = '#666'
    ctx.font = '9px serif'
    ctx.fillText(`Seite ${pageNum} von 3   •   Gesamt: ${data3.length} Einträge   •   Ausdruck vom 15.01.2025`, marginX, totalH - 16)

    ctx.restore()

    const filename = `scan-weiterbildung-${pageNum}.jpg`
    const out = createWriteStream(join(OUT, filename))
    const stream = canvas.createJPEGStream({ quality: 0.88 })
    stream.pipe(out)
    await new Promise(resolve => out.on('finish', resolve))
    console.log(`✅ ${filename}`)
  }
}

// ─── SCAN-PDF (Methode 3, 3 Seiten) ─────────────────────────────────────────

async function generateScanPdf() {
  const employees = JSON.parse(await readFile(join(ROOT, 'src/mock/existingEmployees.json'), 'utf8'))
  const empMap = Object.fromEntries(employees.map(e => [e.mitarbeiterId, e]))

  const header = ['Vorn.'.padEnd(8), 'Nachname'.padEnd(14), 'MitarbNr'.padEnd(10), 'Schulung'.padEnd(35), 'Anfang'.padEnd(12), 'Ende_Dat'.padEnd(12), 'Art'.padEnd(10), 'Anbieter'.padEnd(22), 'Kosten'].join('')
  const sep = '-'.repeat(124)

  function buildPageContent(rows, pageNum) {
    const lines = []
    if (pageNum === 1) {
      lines.push('Weiterbildungsnachweis - Abteilung HR / Stand 2024')
      lines.push('=' .repeat(80))
      lines.push(`Erstellt: 15.01.2025  |  Gesamt: ${data3.length} Eintraege  |  System: Personalverwaltung`)
      lines.push('')
    } else {
      lines.push(`Weiterbildungsnachweis - Fortsetzung (Seite ${pageNum})`)
      lines.push('')
    }
    lines.push(header)
    lines.push(sep)
    for (const r of rows) {
      const emp = empMap[r.mitarbeiterId] || {}
      const vorn  = ((emp.vorname || '').substring(0, 4) + '.').padEnd(8)
      const nach  = (emp.nachname || '').padEnd(14)
      const mnr   = (r.mitarbeiterId || '').replace('MA-','').padEnd(10)
      const bez   = (r.bezeichnung || '').substring(0, 33).padEnd(35)
      const start = (r.startdatum ? r.startdatum.split('-').reverse().join('.') : '').padEnd(12)
      const ende  = (r.enddatum   ? r.enddatum.split('-').reverse().join('.')  : '').padEnd(12)
      const art   = (r.seminarart || '').substring(0, 8).padEnd(10)
      const anb   = (r.veranstalter || '').substring(0, 20).padEnd(22)
      const kost  = r.kosten != null ? String(r.kosten.toFixed(0)) : ''
      lines.push([vorn, nach, mnr, bez, start, ende, art, anb, kost].join(''))
    }
    lines.push('')
    lines.push(sep)
    lines.push(`Seite ${pageNum} von 3`)
    return lines
  }

  const PAGE_SLICES = [data3.slice(0, 18), data3.slice(18, 36), data3.slice(36)]

  // Build content streams for each page
  function buildStream(lines) {
    const ops = ['BT', '/F1 7 Tf', '30 750 Td', '11 TL']
    for (const line of lines) {
      const escaped = line
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .substring(0, 130)
      ops.push(`(${escaped}) Tj T*`)
    }
    ops.push('ET')
    return ops.join('\n')
  }

  const streams = PAGE_SLICES.map((rows, i) => buildStream(buildPageContent(rows, i + 1)))

  // Build PDF objects with byte-accurate xref
  const { writeFile } = await import('fs/promises')

  // Object definitions (as strings, we'll compute offsets)
  // Objects: 1=Catalog, 2=Pages, 3=Page1, 4=Stream1, 5=Page2, 6=Stream2, 7=Page3, 8=Stream3, 9=Font
  const objCount = 9

  function pdfStr(s) { return Buffer.from(s, 'latin1') }

  const stream1 = pdfStr(streams[0])
  const stream2 = pdfStr(streams[1])
  const stream3 = pdfStr(streams[2])

  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R 5 0 R 7 0 R] /Count 3 >>\nendobj\n`
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n   /Contents 4 0 R /Resources << /Font << /F1 9 0 R >> >> >>\nendobj\n`
  const obj4 = `4 0 obj\n<< /Length ${stream1.length} >>\nstream\n${streams[0]}\nendstream\nendobj\n`
  const obj5 = `5 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n   /Contents 6 0 R /Resources << /Font << /F1 9 0 R >> >> >>\nendobj\n`
  const obj6 = `6 0 obj\n<< /Length ${stream2.length} >>\nstream\n${streams[1]}\nendstream\nendobj\n`
  const obj7 = `7 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n   /Contents 8 0 R /Resources << /Font << /F1 9 0 R >> >> >>\nendobj\n`
  const obj8 = `8 0 obj\n<< /Length ${stream3.length} >>\nstream\n${streams[2]}\nendstream\nendobj\n`
  const obj9 = `9 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n`

  const header_str = '%PDF-1.4\n'
  const objs = [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9]

  // Compute offsets
  const offsets = []
  let offset = header_str.length
  for (const obj of objs) {
    offsets.push(offset)
    offset += Buffer.byteLength(obj, 'latin1')
  }
  const xrefOffset = offset

  // Build xref table
  let xref = `xref\n0 ${objCount + 1}\n`
  xref += '0000000000 65535 f \n'
  for (const off of offsets) {
    xref += String(off).padStart(10, '0') + ' 00000 n \n'
  }
  xref += `trailer\n<< /Size ${objCount + 1} /Root 1 0 R >>\n`
  xref += `startxref\n${xrefOffset}\n%%EOF\n`

  const parts = [header_str, ...objs, xref]
  const { writeFile: wf } = await import('fs/promises')
  await wf(join(OUT, 'scan-weiterbildung.pdf'), parts.join(''), 'latin1')
  console.log('✅ scan-weiterbildung.pdf (3 Seiten)')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('Generiere Simulations-Dateien...\n')
await generateVorlage()
await generateCustomExcel()
await generateScanImages()
await generateScanPdf()
console.log('\n✓ Alle Dateien in public/assets/ erstellt.')
