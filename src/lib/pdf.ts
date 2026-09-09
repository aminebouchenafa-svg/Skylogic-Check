import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { RowInput } from 'jspdf-autotable'
import type { FormDef, FormRecord, MatrixDef, SectionDef } from '../types/form'
import { findLevel, getScale } from '../forms/scales'
import { cellId } from './ids'
import type { AppSettings } from './storage'

/**
 * Rendu PDF des formulaires.
 *
 * La mise en page reprend celle du document papier du Training Department
 * (bandeau de titre, tableaux à deux colonnes, remarques, résultat, signatures,
 * pied de page réglementaire). Seule différence voulue : la case de note porte
 * la couleur du code couleur de l'application.
 */

const M = 12
const PAGE_W = 210
const PAGE_H = 297
const CONTENT_W = PAGE_W - M * 2
const GUTTER = 4
const COL_W = (CONTENT_W - GUTTER) / 2
const INK = '#0B1220'
const MUTED = '#5A6B82'
const LINE = '#7C8AA0'

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

/** Teinte pâle d'une couleur, pour les bandeaux de rubrique. */
function tint(hex: string, ratio = 0.14): RGB {
  const [r, g, b] = hexToRgb(hex)
  return [
    Math.round(255 - (255 - r) * ratio),
    Math.round(255 - (255 - g) * ratio),
    Math.round(255 - (255 - b) * ratio),
  ]
}

function fmtDate(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return String(value ?? '')
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

function show(raw: unknown, type = 'text'): string {
  if (raw === null || raw === undefined || raw === '') return ''
  if (type === 'checkbox') return raw ? 'Oui' : 'Non'
  if (type === 'date') return fmtDate(raw)
  return String(raw)
}

export function pdfFileName(form: FormDef, record: FormRecord): string {
  const subject = (record.subject || 'sans-nom')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase()
  const date = String(record.values.date ?? record.createdAt.slice(0, 10))
  const slug = form.title.replace(/[^A-Za-z0-9]+/g, '-').toUpperCase()
  return `${slug}_${subject}_${date}.pdf`
}

function lastY(doc: jsPDF, fallback: number): number {
  const y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
  return typeof y === 'number' ? y : fallback
}

/** Bandeau de titre : intitulé du formulaire et bloc compagnie. */
function drawTitle(doc: jsPDF, form: FormDef, settings: AppSettings, y: number): number {
  const h = 12
  const logoW = 52
  doc.setDrawColor(...hexToRgb(INK))
  doc.setLineWidth(0.5)
  doc.rect(M, y, CONTENT_W - logoW, h)
  doc.rect(M + CONTENT_W - logoW, y, logoW, h)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(form.title.toUpperCase(), M + (CONTENT_W - logoW) / 2, y + 8.8, { align: 'center' })

  if (settings.logo) {
    try {
      doc.addImage(settings.logo, 'PNG', M + CONTENT_W - logoW + 3, y + 2, logoW - 6, h - 4, undefined, 'FAST')
    } catch {
      /* logo illisible : on retombe sur le texte */
    }
  } else {
    doc.setFontSize(10)
    doc.text(settings.operator.toUpperCase(), M + CONTENT_W - logoW / 2, y + 6.5, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...hexToRgb(MUTED))
    doc.text(settings.department, M + CONTENT_W - logoW / 2, y + 10, { align: 'center' })
  }

  // Filet d'accent : rappel de la couleur du formulaire.
  doc.setFillColor(...hexToRgb(form.accent))
  doc.rect(M, y + h, CONTENT_W, 1, 'F')
  return y + h + 4
}

let legendPrinted = false
/**
 * Limite basse du contenu : le pied de page et, le cas échéant, la mention
 * réglementaire sont réservés d'avance pour éviter qu'ils ne débordent seuls
 * sur une page supplémentaire.
 */
let bottomLimit = PAGE_H - 18

function drawLegend(doc: jsPDF, form: FormDef, y: number): number {
  const legend = getScale(form.scaleId).legend
  if (!legend || legendPrinted) return y
  legendPrinted = true
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(`Grading : ${legend.replace(/ · /g, ',  ')}`, M, y)
  return y + 4
}

function drawIdentification(doc: jsPDF, section: SectionDef, record: FormRecord, y: number): number {
  const fields = (section.fields ?? []).filter((f) => f.type !== 'signature' && f.type !== 'textarea')
  const rows: string[][] = []
  for (let i = 0; i < fields.length; i += 2) {
    const a = fields[i]
    const b = fields[i + 1]
    rows.push([
      `${a.label} :`,
      show(record.values[a.id], a.type),
      b ? `${b.label} :` : '',
      b ? show(record.values[b.id], b.type) : '',
    ])
  }
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: M, bottom: PAGE_H - bottomLimit },
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 8.2,
      cellPadding: 1.2,
      lineColor: hexToRgb(INK),
      lineWidth: 0.3,
      textColor: hexToRgb(INK),
    },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 51 },
      2: { cellWidth: 42, fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
    },
  })
  return lastY(doc, y) + 3
}

function drawMatrix(doc: jsPDF, id: string, matrix: MatrixDef, record: FormRecord, y: number): number {
  const head: RowInput[] = []
  if (matrix.groups) {
    head.push(['', ...matrix.groups.map((g) => ({ content: g.label, colSpan: g.span }))])
  }
  head.push(['', ...matrix.columns.map((c) => c.label)])

  const body = matrix.rows.map((row) => [
    row.label,
    ...matrix.columns.map((column) => {
      const raw = record.values[cellId(id, row.id, column.id)]
      const text = show(raw, column.type)
      return text && column.prefix ? `${column.prefix} ${text}` : text
    }),
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: M, bottom: PAGE_H - bottomLimit },
    head,
    body,
    theme: 'grid',
    styles: { fontSize: 7.8, cellPadding: 1.1, lineColor: hexToRgb(INK), lineWidth: 0.3, textColor: hexToRgb(INK), halign: 'center' },
    headStyles: { fillColor: [238, 241, 232], textColor: hexToRgb(INK), fontStyle: 'bold', fontSize: 7.5 },
    columnStyles: { 0: { halign: 'left', fontStyle: 'bold', cellWidth: 34 } },
  })

  let cursor = lastY(doc, y)
  if (matrix.note) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7)
    doc.setTextColor(...hexToRgb(MUTED))
    doc.text(matrix.note, M, cursor + 3.4)
    cursor += 4
  }
  return cursor + 3
}

/** Grille de notation. La case « Grading » porte la couleur du code couleur. */
function drawGrading(
  doc: jsPDF,
  form: FormDef,
  section: SectionDef,
  record: FormRecord,
  x: number,
  y: number,
  width: number,
): number {
  const scale = getScale(section.scaleId ?? form.scaleId)
  const numbered = (section.items ?? []).some((item) => item.code)
  const gradeW = 17
  const codeW = numbered ? 7 : 0

  const body = (section.items ?? []).map((item) => {
    const raw = record.values[item.id]
    if (item.input === 'date') {
      const cells = [item.label, show(raw, 'date') || '/    /']
      return numbered ? [item.code ?? '', ...cells] : cells
    }
    const level = raw ? findLevel(scale, String(raw)) : undefined
    const cells = [item.label, level ? level.short : '']
    return numbered ? [item.code ?? '', ...cells] : cells
  })

  const head = numbered
    ? [['', section.title, 'Grading']]
    : [[section.title, 'Grading']]

  autoTable(doc, {
    startY: y,
    margin: { left: x, right: PAGE_W - x - width, top: M, bottom: PAGE_H - bottomLimit },
    tableWidth: width,
    head,
    body,
    theme: 'grid',
    styles: {
      fontSize: 7.2,
      cellPadding: 0.7,
      lineColor: hexToRgb(INK),
      lineWidth: 0.25,
      textColor: hexToRgb(INK),
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: tint(form.accent),
      textColor: hexToRgb(INK),
      fontStyle: 'bold',
      fontSize: 7.6,
      halign: 'left',
      cellPadding: 1.1,
    },
    columnStyles: numbered
      ? {
          0: { cellWidth: codeW, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: width - codeW - gradeW },
          2: { cellWidth: gradeW, halign: 'center', fontStyle: 'bold' },
        }
      : {
          0: { cellWidth: width - gradeW },
          1: { cellWidth: gradeW, halign: 'center', fontStyle: 'bold' },
        },
    didParseCell: (data) => {
      const gradeCol = numbered ? 2 : 1
      const labelCol = numbered ? 1 : 0
      if (data.section === 'head' && data.column.index === gradeCol) data.cell.styles.halign = 'center'
      if (data.section !== 'body') return

      const item = (section.items ?? [])[data.row.index]
      if (item?.emphasis && data.column.index === labelCol) {
        data.cell.styles.fontStyle = 'bolditalic'
      }
      if (data.column.index !== gradeCol || item?.input === 'date') return

      const level = item ? findLevel(scale, String(record.values[item.id] ?? '')) : undefined
      if (!level) return
      data.cell.styles.fillColor = hexToRgb(level.color)
      data.cell.styles.textColor = isLight(level.color) ? hexToRgb(INK) : [255, 255, 255]
      data.cell.styles.fontSize = 9
    },
  })
  return lastY(doc, y)
}

/** Bloc encadré avec bandeau de titre (Remarks, commentaires). */
function drawBoxed(doc: jsPDF, form: FormDef, title: string, text: string, y: number, minHeight = 15): number {
  const lines = doc.splitTextToSize(text.trim(), CONTENT_W - 10) as string[]
  const bodyH = Math.max(minHeight, lines.length * 3.8 + 5)
  const headH = 6

  if (y + bodyH + headH > bottomLimit) {
    doc.addPage()
    y = M
  }

  doc.setDrawColor(...hexToRgb(INK))
  doc.setLineWidth(0.3)
  doc.setFillColor(...tint(form.accent))
  doc.rect(M, y, CONTENT_W, headH, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(title, M + CONTENT_W / 2, y + 4.2, { align: 'center' })

  doc.rect(M, y + headH, CONTENT_W, bodyH)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.text(lines, M + 3, y + headH + 5)

  // Lignes de guidage, comme sur le formulaire papier.
  doc.setDrawColor(200, 208, 218)
  doc.setLineWidth(0.15)
  for (let ly = y + headH + 7; ly < y + headH + bodyH - 2; ly += 4.6) {
    doc.line(M + 3, ly, M + CONTENT_W - 3, ly)
  }
  return y + headH + bodyH + 3
}

function drawResult(doc: jsPDF, section: SectionDef, record: FormRecord, y: number): number {
  const h = 9
  if (y + h > bottomLimit) {
    doc.addPage()
    y = M
  }
  const labelW = 66
  const choices = section.choices ?? []
  const choiceW = (CONTENT_W - labelW) / Math.max(1, choices.length)

  doc.setDrawColor(...hexToRgb(INK))
  doc.setLineWidth(0.4)
  doc.rect(M, y, labelW, h)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(`${section.title} :`, M + 3, y + 5.8)

  choices.forEach((choice, index) => {
    const x = M + labelW + index * choiceW
    const picked = record.values.result === choice.value
    if (picked) {
      doc.setFillColor(...hexToRgb(choice.color))
      doc.rect(x, y, choiceW, h, 'F')
    }
    doc.setDrawColor(...hexToRgb(INK))
    doc.rect(x, y, choiceW, h)
    const textRgb: RGB = picked ? [255, 255, 255] : hexToRgb(MUTED)
    doc.setTextColor(...textRgb)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(choice.label, x + choiceW / 2, y + 6.1, { align: 'center' })
  })
  return y + h + 3
}

function drawSignatures(doc: jsPDF, section: SectionDef, record: FormRecord, form: FormDef, y: number): number {
  const signatures = (section.fields ?? []).filter((f) => f.type === 'signature')
  const headH = 6
  const boxH = 18
  if (y + headH + boxH > bottomLimit) {
    doc.addPage()
    y = M
  }

  signatures.slice(0, 2).forEach((field, index) => {
    const x = M + index * (COL_W + GUTTER)
    doc.setDrawColor(...hexToRgb(INK))
    doc.setLineWidth(0.35)
    doc.setFillColor(...tint(form.accent))
    doc.rect(x, y, COL_W, headH, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(field.label, x + COL_W / 2, y + 4.2, { align: 'center' })
    doc.rect(x, y + headH, COL_W, boxH)

    const data = record.values[field.id]
    if (typeof data === 'string' && data.startsWith('data:image')) {
      try {
        doc.addImage(data, 'PNG', x + 3, y + headH + 2, COL_W - 6, boxH - 8)
      } catch {
        /* signature illisible : la case reste vide */
      }
    }
    const name = index === 1 ? show(record.values.sig_examiner_name) : show(record.values.name)
    if (name) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...hexToRgb(MUTED))
      doc.text(name, x + 3, y + headH + boxH - 2.5)
    }
  })
  return y + headH + boxH + 3
}

function reminderLines(doc: jsPDF, text: string): string[] {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.4)
  return doc.splitTextToSize(text, CONTENT_W - 22) as string[]
}

function drawReminder(doc: jsPDF, lines: string[], y: number): void {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(200, 25, 40)
  doc.text('Reminder:', M, y + 3.4)
  doc.setFontSize(7.4)
  doc.text(lines, M + 20, y + 3.4)
}

function drawFooters(doc: jsPDF, form: FormDef, settings: AppSettings): void {
  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(...hexToRgb(INK))
    doc.setLineWidth(0.4)
    doc.line(M, PAGE_H - 14, PAGE_W - M, PAGE_H - 14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(form.revision.toUpperCase(), M, PAGE_H - 10)
    doc.text(`© ${settings.operator.toUpperCase()} – All Rights Reserved`, PAGE_W - M, PAGE_H - 10, {
      align: 'right',
    })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...hexToRgb(LINE))
    doc.text(`Page ${page}/${pages}`, PAGE_W / 2, PAGE_H - 6.5, { align: 'center' })
  }
}

/** Hauteur approximative d'une grille, pour décider d'un saut de page. */
function estimate(section: SectionDef): number {
  return 6 + (section.items?.length ?? 0) * 4
}

export function buildPdf(form: FormDef, record: FormRecord, settings: AppSettings): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  legendPrinted = false
  const reminder = form.reminder ? reminderLines(doc, form.reminder) : null
  bottomLimit = PAGE_H - 18 - (reminder ? reminder.length * 3.4 + 3 : 0)
  let y = drawTitle(doc, form, settings, M)

  const sections = form.sections
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i]

    if (section.spread) {
      const group: SectionDef[] = []
      const spread = section.spread
      while (i < sections.length && sections[i].spread === spread) {
        group.push(sections[i])
        i += 1
      }
      i -= 1

      const left = group.filter((s) => s.column !== 'right')
      const right = group.filter((s) => s.column === 'right')
      const needed = Math.max(
        left.reduce((sum, s) => sum + estimate(s), 0),
        right.reduce((sum, s) => sum + estimate(s), 0),
      )
      if (y + needed > bottomLimit - 4 && y > M + 30) {
        doc.addPage()
        y = M
      }

      y = drawLegend(doc, form, y)
      let yLeft = y
      let yRight = y
      for (const s of left) yLeft = drawGrading(doc, form, s, record, M, yLeft, COL_W) + 2
      for (const s of right) yRight = drawGrading(doc, form, s, record, M + COL_W + GUTTER, yRight, COL_W) + 2
      y = Math.max(yLeft, yRight) + 2
      continue
    }

    switch (section.kind) {
      case 'identification':
        y = drawIdentification(doc, section, record, y)
        break
      case 'matrix':
        if (section.matrix) y = drawMatrix(doc, section.id, section.matrix, record, y)
        break
      case 'grading': {
        // On ne rejette la grille sur la page suivante que si l'espace restant
        // ne permet pas d'imprimer son en-tête et quelques lignes.
        if (y + 24 > bottomLimit && y > M + 30) {
          doc.addPage()
          y = M
        }
        y = drawLegend(doc, form, y)
        y = drawGrading(doc, form, section, record, M, y, CONTENT_W) + 3
        if (section.commentField) {
          y = drawBoxed(doc, form, section.commentField.label, show(record.values[section.commentField.id]), y, 22)
        }
        break
      }
      case 'notes': {
        const field = (section.fields ?? [])[0]
        if (field) y = drawBoxed(doc, form, field.label, show(record.values[field.id]), y, 15)
        break
      }
      case 'result':
        y = drawResult(doc, section, record, y)
        break
      case 'signature':
        y = drawSignatures(doc, section, record, form, y)
        break
    }
  }

  if (reminder) drawReminder(doc, reminder, bottomLimit + 2)
  drawFooters(doc, form, settings)
  doc.setPage(1)
  return doc
}

export function buildPdfFile(form: FormDef, record: FormRecord, settings: AppSettings): File {
  const blob = buildPdf(form, record, settings).output('blob')
  return new File([blob], pdfFileName(form, record), { type: 'application/pdf' })
}
