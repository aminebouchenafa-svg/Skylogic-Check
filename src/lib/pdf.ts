import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { FormDef, FormRecord, SectionDef } from '../types/form'
import { getScale, NA_COLOR } from '../forms/scales'
import type { AppSettings } from './storage'

const MARGIN = 13
const BAND_H = 24
const INK = '#0B1220'
const MUTED = '#6B7A90'
const LINE = '#D7DEE8'

type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function isLight(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

function fmtDate(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return String(value ?? '')
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

function displayValue(raw: unknown, type: string): string {
  if (raw === null || raw === undefined || raw === '') return '—'
  if (type === 'checkbox') return raw ? 'Oui' : 'Non'
  if (type === 'date') return fmtDate(raw)
  return String(raw)
}

/** Nom de fichier normalisé, lisible dans une boîte mail ou WhatsApp. */
export function pdfFileName(form: FormDef, record: FormRecord): string {
  const subject = (record.subject || 'sans-nom')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase()
  const date = String(record.values.date ?? record.createdAt.slice(0, 10))
  return `${form.code}_${subject}_${date}.pdf`
}

function drawBand(doc: jsPDF, form: FormDef, settings: AppSettings, page: number): void {
  const w = doc.internal.pageSize.getWidth()
  doc.setFillColor(...hexToRgb(INK))
  doc.rect(0, 0, w, BAND_H, 'F')
  doc.setFillColor(...hexToRgb(form.accent))
  doc.rect(0, BAND_H - 1.6, w, 1.6, 'F')

  // Marque : chevron d'accent + nom de l'application.
  doc.setFillColor(...hexToRgb(form.accent))
  doc.triangle(MARGIN, 8, MARGIN + 6, 11.5, MARGIN, 15, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(page === 1 ? 14 : 11)
  doc.text(form.title.toUpperCase(), MARGIN + 10, page === 1 ? 12 : 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(170, 185, 205)
  if (page === 1 && form.subtitle) doc.text(form.subtitle, MARGIN + 10, 17.5)

  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  doc.text(settings.operator.toUpperCase(), doc.internal.pageSize.getWidth() - MARGIN, 10, { align: 'right' })
  doc.setFontSize(7.5)
  doc.setTextColor(170, 185, 205)
  doc.text(settings.department, doc.internal.pageSize.getWidth() - MARGIN, 14.5, { align: 'right' })
  doc.text(`${form.code} · ${form.revision}`, doc.internal.pageSize.getWidth() - MARGIN, 19, { align: 'right' })
}

function sectionHeading(doc: jsPDF, form: FormDef, section: SectionDef, y: number): number {
  const w = doc.internal.pageSize.getWidth()
  doc.setFillColor(...hexToRgb(form.accent))
  doc.rect(MARGIN, y - 3.4, 2.2, 4.6, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(section.title.toUpperCase(), MARGIN + 5, y)
  if (section.subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...hexToRgb(MUTED))
    doc.text(section.subtitle, MARGIN + 5, y + 4)
  }
  const bottom = y + (section.subtitle ? 7 : 3)
  doc.setDrawColor(...hexToRgb(LINE))
  doc.setLineWidth(0.2)
  doc.line(MARGIN, bottom, w - MARGIN, bottom)
  return bottom + 4
}

function lastTableY(doc: jsPDF, fallback: number): number {
  const y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
  return typeof y === 'number' ? y : fallback
}

/** Sections d'identification : grille libellé / valeur sur deux colonnes. */
function renderFieldGrid(doc: jsPDF, section: SectionDef, record: FormRecord, y: number): number {
  const fields = (section.fields ?? []).filter((f) => f.type !== 'signature' && f.type !== 'textarea')
  const rows: string[][] = []
  for (let i = 0; i < fields.length; i += 2) {
    const a = fields[i]
    const b = fields[i + 1]
    rows.push([
      a.label,
      displayValue(record.values[a.id], a.type),
      b ? b.label : '',
      b ? displayValue(record.values[b.id], b.type) : '',
    ])
  }

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, top: BAND_H + 8 },
    body: rows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.8, lineColor: hexToRgb(LINE), lineWidth: 0.15, textColor: hexToRgb(INK) },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold', textColor: hexToRgb(MUTED), fontSize: 7.2 },
      1: { cellWidth: 54 },
      2: { cellWidth: 38, fontStyle: 'bold', textColor: hexToRgb(MUTED), fontSize: 7.2 },
      3: { cellWidth: 'auto' },
    },
  })

  let cursor = lastTableY(doc, y) + 4
  const longFields = (section.fields ?? []).filter((f) => f.type === 'textarea')
  for (const field of longFields) {
    cursor = renderTextBlock(doc, field.label, String(record.values[field.id] ?? ''), cursor)
  }
  return cursor
}

function renderTextBlock(doc: jsPDF, label: string, text: string, y: number): number {
  const w = doc.internal.pageSize.getWidth() - MARGIN * 2
  const body = text.trim() || '—'
  const lines = doc.splitTextToSize(body, w - 6) as string[]
  const height = Math.max(14, lines.length * 3.9 + 9)

  if (y + height > doc.internal.pageSize.getHeight() - 22) {
    doc.addPage()
    y = BAND_H + 8
  }

  doc.setDrawColor(...hexToRgb(LINE))
  doc.setFillColor(249, 251, 253)
  doc.setLineWidth(0.15)
  doc.roundedRect(MARGIN, y, w, height, 1.2, 1.2, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...hexToRgb(MUTED))
  doc.text(label.toUpperCase(), MARGIN + 3, y + 4.5)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(lines, MARGIN + 3, y + 9)
  return y + height + 4
}

/** Grille de notation : la case de note porte la couleur du code couleur. */
function renderGrading(doc: jsPDF, form: FormDef, section: SectionDef, record: FormRecord, y: number): number {
  const scale = getScale(section.scaleId ?? form.scaleId)
  const rows = (section.items ?? []).map((item) => {
    const raw = record.values[item.id]
    const value = raw === null || raw === undefined || raw === '' ? '' : String(raw)
    const level = scale.levels.find((l) => l.value === value)
    return [item.code ?? '', item.label, value === 'NA' ? 'N/A' : value || '—', level?.label ?? (value === 'NA' ? 'Non applicable' : 'Non noté')]
  })

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, top: BAND_H + 8 },
    head: [['Réf.', 'Élément évalué', 'Note', 'Appréciation']],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: hexToRgb(LINE), lineWidth: 0.15, textColor: hexToRgb(INK) },
    headStyles: {
      fillColor: hexToRgb(INK),
      textColor: [255, 255, 255],
      fontSize: 7.2,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center', textColor: hexToRgb(MUTED), fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 45, fontSize: 7.5 },
    },
    didParseCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 2) return
      const value = String(data.cell.raw)
      const level = scale.levels.find((l) => l.value === value)
      const color = level ? level.color : value === 'N/A' ? NA_COLOR : null
      if (!color) return
      data.cell.styles.fillColor = hexToRgb(color)
      data.cell.styles.textColor = isLight(color) ? hexToRgb(INK) : [255, 255, 255]
    },
  })

  let cursor = lastTableY(doc, y) + 4
  if (section.commentField) {
    cursor = renderTextBlock(doc, section.commentField.label, String(record.values[section.commentField.id] ?? ''), cursor)
  }
  return cursor
}

function renderSignatures(doc: jsPDF, section: SectionDef, record: FormRecord, y: number): number {
  const pageW = doc.internal.pageSize.getWidth()
  const boxW = (pageW - MARGIN * 2 - 6) / 2
  const boxH = 26

  if (y + boxH + 14 > doc.internal.pageSize.getHeight() - 22) {
    doc.addPage()
    y = BAND_H + 8
  }

  const signatures = (section.fields ?? []).filter((f) => f.type === 'signature')
  signatures.slice(0, 2).forEach((field, index) => {
    const x = MARGIN + index * (boxW + 6)
    doc.setDrawColor(...hexToRgb(LINE))
    doc.setFillColor(255, 255, 255)
    doc.setLineWidth(0.15)
    doc.roundedRect(x, y, boxW, boxH, 1.2, 1.2, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...hexToRgb(MUTED))
    doc.text(field.label.toUpperCase(), x + 3, y + 4.5)
    const data = record.values[field.id]
    if (typeof data === 'string' && data.startsWith('data:image')) {
      try {
        doc.addImage(data, 'PNG', x + 3, y + 6, boxW - 6, boxH - 9)
      } catch {
        /* signature illisible : la case reste vide */
      }
    }
  })

  let cursor = y + boxH + 4
  const ack = (section.fields ?? []).find((f) => f.type === 'checkbox')
  if (ack) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(`${record.values[ack.id] ? '[X]' : '[  ]'}  ${ack.label}`, MARGIN, cursor + 2)
    cursor += 7
  }
  return cursor
}

function drawFooters(doc: jsPDF, form: FormDef, record: FormRecord, settings: AppSettings): void {
  const pages = doc.getNumberOfPages()
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(...hexToRgb(LINE))
    doc.setLineWidth(0.2)
    doc.line(MARGIN, h - 14, w - MARGIN, h - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.8)
    doc.setTextColor(...hexToRgb(MUTED))
    doc.text(`${settings.operator} · ${settings.department} · ${form.code}`, MARGIN, h - 9.5)
    doc.text(
      `Document a usage interne - Edite le ${new Date().toLocaleString('fr-FR')} - Ref ${record.id}`,
      MARGIN,
      h - 6,
    )
    doc.text(`Page ${page}/${pages}`, w - MARGIN, h - 9.5, { align: 'right' })
  }
}

export function buildPdf(form: FormDef, record: FormRecord, settings: AppSettings): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  drawBand(doc, form, settings, 1)
  let y = BAND_H + 9

  for (const section of form.sections) {
    if (y > doc.internal.pageSize.getHeight() - 45) {
      doc.addPage()
      y = BAND_H + 9
    }
    y = sectionHeading(doc, form, section, y)
    if (section.kind === 'grading') y = renderGrading(doc, form, section, record, y)
    else if (section.kind === 'signature') y = renderSignatures(doc, section, record, y)
    else y = renderFieldGrid(doc, section, record, y)
    y += 3
  }

  for (let page = 2; page <= doc.getNumberOfPages(); page += 1) {
    doc.setPage(page)
    drawBand(doc, form, settings, page)
  }
  drawFooters(doc, form, record, settings)
  doc.setPage(1)
  return doc
}

export function buildPdfFile(form: FormDef, record: FormRecord, settings: AppSettings): File {
  const blob = buildPdf(form, record, settings).output('blob')
  return new File([blob], pdfFileName(form, record), { type: 'application/pdf' })
}
