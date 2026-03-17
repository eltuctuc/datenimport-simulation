import { useImportStore } from '@/stores/useImportStore'
import { useFeedbackStore } from '@/stores/useFeedbackStore'

const METHODE_LABELS = {
  1: 'Methode 1 – Excel-Vorlage',
  2: 'Methode 2 – Eigene Excel',
  3: 'Methode 3 – Bild / PDF',
}

function stars(n) {
  return n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '–'
}

function esc(str) {
  return str ? String(str).replace(/\|/g, '\\|') : ''
}

export function useMarkdownExport() {
  function generate() {
    const importStore = useImportStore()
    const feedbackStore = useFeedbackStore()
    const now = new Date().toLocaleString('de-DE')

    let md = `# Datenimport-Simulation – Auswertung\n\n`
    md += `**Erstellt am:** ${now}\n\n---\n\n`

    // Feedback pro Methode
    md += `## Feedback der Testnutzer\n\n`
    for (const n of [1, 2, 3]) {
      const fb = feedbackStore[`methode${n}`]
      md += `### ${METHODE_LABELS[n]}\n\n`
      if (fb) {
        md += `| Dimension | Bewertung |\n|---|---|\n`
        md += `| Einfachheit | ${stars(fb.einfachheit)} (${fb.einfachheit}/5) |\n`
        md += `| Praxisnähe | ${stars(fb.praxisnaehe)} (${fb.praxisnaehe}/5) |\n`
        md += `| Neuartigkeit | ${stars(fb.neuartigkeit)} (${fb.neuartigkeit}/5) |\n\n`
        if (fb.anmerkungen) md += `**Anmerkungen:** ${esc(fb.anmerkungen)}\n\n`
      } else {
        md += `_Noch nicht abgeschlossen._\n\n`
      }
    }

    // Vergleichendes Fazit
    if (feedbackStore.comparativeFeedback) {
      const cf = feedbackStore.comparativeFeedback
      md += `---\n\n## Vergleichendes Fazit\n\n`
      md += `**Bevorzugte Methode:** ${METHODE_LABELS[cf.bevorzugteMethode]}\n\n`
      if (cf.begruendung) md += `**Begründung:** ${esc(cf.begruendung)}\n\n`
    }

    // Importierte Datensätze
    const records = importStore.importedRecords
    md += `---\n\n## Importierte Datensätze (${records.length})\n\n`
    if (records.length > 0) {
      md += `| Nr. | Mitarbeiter-ID | Bezeichnung | Startdatum | Status | Seminartyp |\n`
      md += `|---|---|---|---|---|---|\n`
      records.forEach((r, i) => {
        md += `| ${i + 1} | ${esc(r.mitarbeiterId)} | ${esc(r.bezeichnung)} | ${esc(r.startdatum)} | ${esc(r.status)} | ${esc(r.seminartyp)} |\n`
      })
    } else {
      md += `_Keine Datensätze importiert._\n`
    }

    return md
  }

  function download() {
    const content = generate()
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `datenimport-auswertung-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { download, generate }
}
