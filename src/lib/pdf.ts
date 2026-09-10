import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { RowInput } from 'jspdf-autotable'
import type { FieldDef, FormDef, FormRecord, GradedItemDef, MatrixDef, SectionDef } from '../types/form'
import { findLevel, getScale, selectableLevels } from '../forms/scales'
import { answerId, cellId, gradeId, remarkId, tickId } from './ids'
import { columnTotal } from './totals'
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

/**
 * Version pastel d'une couleur du code couleur : la teinte reste
 * reconnaissable, l'encre reste noire, et le document s'imprime sans écraser
 * les aplats.
 */
function pastel(hex: string): RGB {
  const [r, g, b] = hexToRgb(hex)
  const melange = (c: number) => Math.round(c + (255 - c) * 0.55)
  return [melange(r), melange(g), melange(b)]
}

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
  doc.setTextColor(...hexToRgb(INK))
  const heading = (form.printTitle ?? form.title).toUpperCase()
  const titreW = CONTENT_W - logoW - 6
  // On réduit la taille tant que le titre déborde du cadre, puis on le passe
  // sur deux lignes : un intitulé long ne doit jamais mordre sur le logo.
  let taille = 16
  while (taille > 10 && doc.getStringUnitWidth(heading) * taille * 0.352778 > titreW) taille -= 0.5
  doc.setFontSize(taille)
  const lignes = doc.splitTextToSize(heading, titreW) as string[]
  const centre = M + (CONTENT_W - logoW) / 2
  if (lignes.length > 1) {
    doc.setFontSize(Math.min(taille, 11))
    doc.text(lignes.slice(0, 2), centre, y + 5.6, { align: 'center', lineHeightFactor: 1.3 })
  } else {
    doc.text(heading, centre, y + 8.6, { align: 'center' })
  }

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

  /** Valeur imprimée, préfixe choisi compris (ex. « PP 1124 »). */
  const valeur = (field: FieldDef) => {
    const texte = show(record.values[field.id], field.type)
    const prefixe = field.prefixOptions?.length
      ? show(record.values[`${field.id}_prefix`])
      : (field.prefix ?? '')
    return texte && prefixe ? `${prefixe} ${texte}` : texte
  }
  const pairs = section.pairsPerRow ?? 2
  const labelW = pairs === 3 ? 28 : 42
  const valueW = (CONTENT_W - labelW * pairs) / pairs

  const rows: RowInput[] = []
  let buffer: FieldDef[] = []
  const flush = () => {
    if (!buffer.length) return
    const row: string[] = []
    for (let k = 0; k < pairs; k += 1) {
      const field = buffer[k]
      row.push(field ? `${field.label} :` : '', field ? valeur(field) : '')
    }
    rows.push(row)
    buffer = []
  }
  for (const field of fields) {
    if (field.width === 'full') {
      flush()
      // Un champ pleine largeur occupe sa propre ligne, valeur étirée.
      rows.push([`${field.label} :`, { content: valeur(field), colSpan: pairs * 2 - 1 }])
      continue
    }
    buffer.push(field)
    if (buffer.length === pairs) flush()
  }
  flush()
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
    columnStyles: Object.fromEntries(
      Array.from({ length: pairs * 2 }, (_, i) =>
        i % 2 === 0
          ? [i, { cellWidth: labelW, fontStyle: 'bold' as const }]
          : [i, { cellWidth: valueW }],
      ),
    ),
  })
  return lastY(doc, y) + 3
}

function drawMatrix(
  doc: jsPDF,
  id: string,
  matrix: MatrixDef,
  record: FormRecord,
  y: number,
  title?: string,
): number {
  const lead = matrix.hideRowLabels ? [] : ['']
  const head: RowInput[] = []
  const largeur = matrix.columns.length + lead.length
  if (title) {
    head.push([{ content: title, colSpan: largeur, styles: { halign: 'center' } }])
  }
  if (matrix.groups) {
    head.push([...lead, ...matrix.groups.map((g) => ({ content: g.label, colSpan: g.span }))])
  }
  head.push([...lead, ...matrix.columns.map((c) => c.label)])

  const signatures = matrix.columns.some((c) => c.type === 'signature')
  const decalage = matrix.hideRowLabels ? 0 : 1

  const body = matrix.rows.map((row) => [
    ...(matrix.hideRowLabels ? [] : [row.label]),
    ...matrix.columns.map((column) => {
      if (column.type === 'signature') return ''
      // Une ligne de total porte la somme des lignes saisies au-dessus.
      if (row.computed) return columnTotal(id, matrix, column.id, record.values)
      const raw = record.values[cellId(id, row.id, column.id)]
      if (column.type === 'checkbox') return raw === 'x' ? 'X' : ''
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
    styles: {
      fontSize: 7.8,
      cellPadding: 1.1,
      lineColor: hexToRgb(INK),
      lineWidth: 0.3,
      textColor: hexToRgb(INK),
      halign: 'center',
      // La hauteur n'est imposée que si une case doit recevoir une signature :
      // passer « undefined » ici écrase le défaut et aplatit les lignes.
      ...(signatures ? { minCellHeight: 14 } : {}),
    },
    headStyles: {
      fillColor: [238, 241, 232],
      textColor: hexToRgb(INK),
      fontStyle: 'bold',
      fontSize: 7.5,
      // La hauteur réservée aux signatures ne concerne que le corps du tableau.
      minCellHeight: 0,
    },
    columnStyles: matrix.hideRowLabels ? {} : { 0: { halign: 'left', fontStyle: 'bold', cellWidth: 34 } },
    didDrawCell: (data) => {
      if (data.section !== 'body') return
      const column = matrix.columns[data.column.index - decalage]
      if (column?.type !== 'signature') return
      const valeur = record.values[cellId(id, matrix.rows[data.row.index].id, column.id)]
      if (typeof valeur !== 'string' || !valeur.startsWith('data:image')) return
      try {
        const { x, y: cy, width, height } = data.cell
        doc.addImage(valeur, 'PNG', x + 2, cy + 1.5, width - 4, height - 3)
      } catch {
        /* signature illisible : la case reste vide */
      }
    },
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

/**
 * Grille de notation. La case porte la couleur du code couleur ; une grille
 * peut comporter plusieurs colonnes, une par secteur évalué.
 */
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
  const items = section.items ?? []
  // En présentation « grid », chaque niveau de l'échelle occupe sa colonne.
  const grille = section.gradeLayout === 'grid'
  const niveaux = grille ? selectableLevels(scale) : []
  const colonnes = grille
    ? niveaux.map((n) => ({ id: n.value, label: n.short }))
    : (section.gradeColumns ?? [{ id: '', label: 'Grading' }])
  const multiple = grille || Boolean(section.gradeColumns)
  const numbered = items.some((item) => item.code)
  const gradeW = grille ? 11 : multiple ? 10 : 17
  const codeW = numbered ? 7 : 0
  const pad = multiple ? 1 : 0.7
  // Colonne de remarque propre à chaque item, quand le document en prévoit une.
  const remarques = section.itemRemarks
  const remarkW = remarques ? width * 0.36 : 0
  const textW = width - codeW - remarkW - gradeW * colonnes.length

  const valeur = (item: GradedItemDef, colId: string) =>
    record.values[colId ? gradeId(item.id, colId) : item.id]

  doc.setFontSize(7.2)
  const wrapped = new Map<string, string[]>()

  const body: RowInput[] = items.map((item) => {
    let libelle = item.label
    if (item.description) {
      const lignes = wrapAfterLabel(doc, item.label, item.description, textW - pad * 2)
      wrapped.set(item.id, lignes)
      libelle = lignes.join(' ')
    }
    const notes = item.heading
      ? colonnes.map(() => '')
      : colonnes.map((col) => {
          if (grille) {
            // La case n'est remplie que si elle correspond à la note retenue.
            return String(record.values[item.id] ?? '') === col.id ? col.label : ''
          }
          const brut = valeur(item, col.id)
          if (item.input === 'date') return show(brut, 'date') || '/    /'
          const niveau = brut ? findLevel(scale, String(brut)) : undefined
          return niveau ? niveau.short : ''
        })
    const suite = remarques && !item.heading ? [show(record.values[remarkId(item.id)])] : remarques ? [''] : []
    return numbered ? [item.code ?? '', libelle, ...notes, ...suite] : [libelle, ...notes, ...suite]
  })

  const entete = [...colonnes.map((c) => c.label), ...(remarques ? [remarques.label] : [])]
  const head: RowInput[] = [numbered ? ['', section.title, ...entete] : [section.title, ...entete]]

  const labelCol = numbered ? 1 : 0
  const premiereNote = labelCol + 1

  const columnStyles: Record<number, Partial<{ cellWidth: number; halign: 'center' | 'left'; fontStyle: 'bold' }>> = {}
  if (numbered) columnStyles[0] = { cellWidth: codeW, halign: 'center', fontStyle: 'bold' }
  columnStyles[labelCol] = { cellWidth: textW }
  colonnes.forEach((_, i) => {
    columnStyles[premiereNote + i] = { cellWidth: gradeW, halign: 'center', fontStyle: 'bold' }
  })
  if (remarques) columnStyles[premiereNote + colonnes.length] = { cellWidth: remarkW, halign: 'left' }

  autoTable(doc, {
    startY: y,
    margin: { left: x, right: PAGE_W - x - width, top: M, bottom: PAGE_H - bottomLimit },
    tableWidth: width,
    head,
    body,
    theme: 'grid',
    styles: {
      fontSize: 7.2,
      cellPadding: pad,
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
    columnStyles,
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index >= premiereNote) data.cell.styles.halign = 'center'
      if (data.section !== 'body') return

      const item = items[data.row.index]
      if (!item) return

      if (item.heading) {
        data.cell.styles.fillColor =
          data.column.index >= premiereNote ? [225, 228, 233] : tint(form.accent, 0.22)
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = 7.6
        return
      }
      if (item.emphasis && data.column.index === labelCol) data.cell.styles.fontStyle = 'bolditalic'
      if (data.column.index < premiereNote) {
        if (data.column.index === labelCol) {
          const lignes = wrapped.get(item.id)
          if (lignes) data.cell.text = lignes
        }
        return
      }
      if (item.input === 'date') return
      if (data.column.index >= premiereNote + colonnes.length) return

      const col = colonnes[data.column.index - premiereNote]
      const niveau = grille
        ? String(record.values[item.id] ?? '') === col.id
          ? findLevel(scale, col.id)
          : undefined
        : findLevel(scale, String(valeur(item, col.id) ?? ''))
      if (!niveau) return
      data.cell.styles.fillColor = pastel(niveau.color)
      data.cell.styles.textColor = hexToRgb(INK)
      data.cell.styles.fontSize = multiple ? 8 : 9
    },
    didDrawCell: (data) => {
      // Le libellé en gras est redessiné par-dessus la première ligne.
      if (data.section !== 'body' || data.column.index !== labelCol) return
      const item = items[data.row.index]
      const lignes = item && !item.heading ? wrapped.get(item.id) : undefined
      if (!item || !lignes) return

      const { x: cx, y: cy, width: cw, height: ch } = data.cell
      doc.setFillColor(255, 255, 255)
      doc.rect(cx + 0.15, cy + 0.15, cw - 0.3, ch - 0.3, 'F')

      doc.setFontSize(7.2)
      doc.setTextColor(...hexToRgb(INK))
      const base = cy + pad + 2.2
      doc.setFont('helvetica', 'bold')
      doc.text(item.label, cx + pad, base)
      const largeurLibelle = doc.getTextWidth(`${item.label} `)
      doc.setFont('helvetica', 'normal')
      lignes.forEach((ligne, i) => {
        doc.text(ligne, cx + pad + (i === 0 ? largeurLibelle : 0), base + i * 3.1)
      })
    },
  })
  return lastY(doc, y)
}

/** Trait de découpe, comme les pointillés du formulaire papier. */
function drawDivider(doc: jsPDF, section: SectionDef, y: number): number {
  if (y + 12 > bottomLimit) {
    doc.addPage()
    y = M
  }
  doc.setDrawColor(...hexToRgb(MUTED))
  doc.setLineWidth(0.3)
  doc.setLineDashPattern([1.6, 1.4], 0)
  doc.line(M, y + 4, PAGE_W - M, y + 4)
  doc.setLineDashPattern([], 0)

  if (section.title) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(section.title, M, y + 10)
    return y + 13
  }
  return y + 8
}

/** Grille de réponses numérotées d'un questionnaire. */
function drawAnswers(doc: jsPDF, form: FormDef, section: SectionDef, record: FormRecord, y: number): number {
  const total = section.answerCount ?? 10
  const numeros = Array.from({ length: total }, (_, i) => String(i + 1))
  const reponses = numeros.map((_, i) => show(record.values[answerId(section.id, i + 1)]))

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: M, bottom: PAGE_H - bottomLimit },
    head: [[{ content: section.title, colSpan: total }], numeros],
    body: [reponses],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: hexToRgb(INK),
      lineWidth: 0.25,
      textColor: hexToRgb(INK),
      halign: 'center',
      minCellHeight: 8,
    },
    headStyles: { fillColor: tint(form.accent), textColor: hexToRgb(INK), fontStyle: 'bold', fontSize: 7.6 },
    didParseCell: (data) => {
      if (data.section === 'head' && data.row.index === 0) data.cell.styles.halign = 'left'
    },
  })
  return lastY(doc, y) + 3
}

/** Plusieurs choix en ligne : la case retenue porte sa couleur. */
function drawChoiceRows(doc: jsPDF, form: FormDef, section: SectionDef, record: FormRecord, y: number): number {
  const rows = section.choiceRows ?? []
  const maxOptions = Math.max(1, ...rows.map((r) => r.options.length))
  const labelW = 70
  const optionW = (CONTENT_W - labelW) / maxOptions

  const columnStyles: Record<number, { cellWidth: number; halign?: 'center'; fontStyle?: 'bold' }> = {
    0: { cellWidth: labelW, fontStyle: 'bold' },
  }
  for (let i = 1; i <= maxOptions; i += 1) columnStyles[i] = { cellWidth: optionW, halign: 'center' }

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: M, bottom: PAGE_H - bottomLimit },
    head: [[{ content: section.title, colSpan: maxOptions + 1 }]],
    body: rows.map((row) => [
      row.hint ? `${row.label}  (${row.hint})` : row.label,
      ...Array.from({ length: maxOptions }, (_, i) => row.options[i]?.label ?? ''),
    ]),
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1.9,
      lineColor: hexToRgb(INK),
      lineWidth: 0.25,
      textColor: hexToRgb(INK),
    },
    headStyles: { fillColor: tint(form.accent), textColor: hexToRgb(INK), fontStyle: 'bold', fontSize: 7.6 },
    columnStyles,
    didParseCell: (data) => {
      if (data.section !== 'body' || data.column.index === 0) return
      const row = rows[data.row.index]
      const option = row?.options[data.column.index - 1]
      if (!option || record.values[row.id] !== option.value) return
      data.cell.styles.fillColor = pastel(option.color)
      data.cell.styles.textColor = hexToRgb(INK)
      data.cell.styles.fontStyle = 'bold'
    },
  })
  return lastY(doc, y) + 3
}

/** Tableau de référence : barème détaillé, notes et consignes. */
function drawReference(doc: jsPDF, form: FormDef, section: SectionDef, y: number): number {
  const rows = section.referenceRows ?? []
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: M, bottom: PAGE_H - bottomLimit },
    head: [[{ content: section.title, colSpan: 2 }]],
    body: rows.map((row) => [row.label, row.description]),
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 1.4,
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
    },
    columnStyles: { 0: { cellWidth: 12, halign: 'center', fontStyle: 'bold', fontSize: 9 } },
    didParseCell: (data) => {
      if (data.section !== 'body' || data.column.index !== 0) return
      const couleur = rows[data.row.index]?.color
      if (!couleur) return
      data.cell.styles.fillColor = pastel(couleur)
      data.cell.styles.textColor = hexToRgb(INK)
    },
  })
  return lastY(doc, y) + 3
}

/**
 * Découpe un texte en lignes, la première étant raccourcie de la largeur du
 * libellé en gras qui la précède.
 */
function wrapAfterLabel(doc: jsPDF, label: string, text: string, width: number): string[] {
  doc.setFont('helvetica', 'bold')
  const labelW = doc.getTextWidth(`${label} `)
  doc.setFont('helvetica', 'normal')

  const lines: string[] = []
  let current = ''
  let available = width - labelW
  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word
    if (doc.getTextWidth(candidate) <= available || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
      available = width
    }
  }
  lines.push(current)
  return lines
}

/**
 * Liste à cocher : items relevés dans l'une des colonnes, sans notation.
 * Le libellé est imprimé en gras, ses indicateurs à la suite en romain.
 */
function drawChecklist(
  doc: jsPDF,
  form: FormDef,
  section: SectionDef,
  record: FormRecord,
  y: number,
): number {
  const columns = section.tickColumns ?? []
  const suite = section.trailingColumns ?? []
  const tickW = 17
  const suiteW = suite.length ? 34 : 0
  const textW = CONTENT_W - columns.length * tickW - suite.length * suiteW
  const items = section.items ?? []
  const pad = 1.3
  const wrapped = new Map<string, string[]>()

  doc.setFontSize(7.2)
  const body: RowInput[] = items.map((item) => {
    if (item.description) {
      const lines = wrapAfterLabel(doc, item.label, item.description, textW - pad * 2)
      wrapped.set(item.id, lines)
      return [
        lines.join(' '),
        ...columns.map((c) => (record.values[tickId(item.id, c.id)] ? (c.mark ?? 'X') : '')),
        ...suite.map((c) => show(record.values[tickId(item.id, c.id)], c.type)),
      ]
    }
    return [
      item.label,
      ...columns.map((c) => (record.values[tickId(item.id, c.id)] ? (c.mark ?? 'X') : '')),
      ...suite.map((c) => show(record.values[tickId(item.id, c.id)], c.type)),
    ]
  })

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M, top: M, bottom: PAGE_H - bottomLimit },
    head: [[section.title, ...columns.map((c) => c.label), ...suite.map((c) => c.label)]],
    body,
    theme: 'grid',
    styles: {
      fontSize: 7.2,
      cellPadding: pad,
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
      halign: 'center',
    },
    columnStyles: Object.fromEntries([
      [0, { cellWidth: textW }],
      ...columns.map((_, i) => [
        i + 1,
        { cellWidth: tickW, halign: 'center' as const, fontStyle: 'bold' as const },
      ]),
      ...suite.map((_, i) => [
        columns.length + i + 1,
        { cellWidth: suiteW, halign: 'center' as const },
      ]),
    ]),
    didParseCell: (data) => {
      if (data.section !== 'body') return
      const item = items[data.row.index]
      if (!item) return

      if (item.heading) {
        data.cell.styles.fillColor = tint(form.accent, 0.22)
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = 7.6
        if (data.column.index > 0) data.cell.styles.fillColor = [225, 228, 233]
        return
      }
      if (data.column.index === 0) {
        const lines = wrapped.get(item.id)
        if (lines) data.cell.text = lines
        return
      }
      if (data.column.index > columns.length) return
      if (data.cell.raw) {
        const couleur = columns[data.column.index - 1]?.color ?? form.accent
        data.cell.styles.fillColor = pastel(couleur)
        data.cell.styles.textColor = hexToRgb(INK)
        data.cell.styles.fontSize = 9
      }
    },
    didDrawCell: (data) => {
      // Le libellé en gras est redessiné par-dessus la première ligne.
      if (data.section !== 'body' || data.column.index !== 0) return
      const item = items[data.row.index]
      const lines = item && !item.heading ? wrapped.get(item.id) : undefined
      if (!item || !lines) return

      const { x, y: cy, width, height } = data.cell
      doc.setFillColor(255, 255, 255)
      doc.rect(x + 0.15, cy + 0.15, width - 0.3, height - 0.3, 'F')

      doc.setFontSize(7.2)
      doc.setTextColor(...hexToRgb(INK))
      const lh = 3.1
      const baseY = cy + pad + 2.2
      doc.setFont('helvetica', 'bold')
      doc.text(item.label, x + pad, baseY)
      const labelW = doc.getTextWidth(`${item.label} `)
      doc.setFont('helvetica', 'normal')
      lines.forEach((line, index) => {
        doc.text(line, x + pad + (index === 0 ? labelW : 0), baseY + index * lh)
      })
    },
  })

  let cursor = lastY(doc, y)
  if (section.note) {
    doc.setFont('helvetica', 'bolditalic')
    doc.setFontSize(7)
    doc.setTextColor(...hexToRgb(INK))
    const noteLines = doc.splitTextToSize(section.note, CONTENT_W) as string[]
    doc.text(noteLines, M, cursor + 3.4)
    cursor += noteLines.length * 3.2 + 2
  }
  return cursor + 3
}

/** Bloc de commentaire suivi d'un visa nominatif (nom, fonction, signature). */
function drawEndorsement(
  doc: jsPDF,
  form: FormDef,
  section: SectionDef,
  record: FormRecord,
  y: number,
): number {
  const fields = section.fields ?? []
  const comment = fields.find((f) => f.type === 'textarea')
  const strip = fields.filter((f) => f.type !== 'textarea')
  const headH = 6
  const stripH = strip.length ? 20 : 0

  doc.setFontSize(8.5)
  const lines = comment
    ? (doc.splitTextToSize(show(record.values[comment.id]).trim(), CONTENT_W - 10) as string[])
    : []
  const boxH = comment ? Math.max(30, lines.length * 3.8 + 6) : 0

  if (y + headH + boxH + stripH > bottomLimit) {
    doc.addPage()
    y = M
  }

  doc.setDrawColor(...hexToRgb(INK))
  doc.setLineWidth(0.35)
  doc.setFillColor(...tint(form.accent))
  doc.rect(M, y, CONTENT_W, headH, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...hexToRgb(INK))
  doc.text(section.title.toUpperCase(), M + CONTENT_W / 2, y + 4.2, { align: 'center' })

  if (section.note) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const lignes = doc.splitTextToSize(section.note, CONTENT_W - 8) as string[]
    const h = lignes.length * 4 + 3
    doc.rect(M, y + headH, CONTENT_W, h)
    doc.text(lignes, M + 4, y + headH + 4.5)
    y += h
  }

  if (comment) {
    doc.rect(M, y + headH, CONTENT_W, boxH)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    if (lines.length) doc.text(lines, M + 3, y + headH + 5.5)
    doc.setDrawColor(205, 212, 222)
    doc.setLineWidth(0.15)
    const debut = y + headH + (lines.length ? 5.5 + lines.length * 3.8 : 7.5)
    for (let ly = debut; ly < y + headH + boxH - 2; ly += 4.6) {
      doc.line(M + 3, ly, M + CONTENT_W - 3, ly)
    }
  }

  if (!strip.length) return y + headH + boxH + 3

  const cellW = CONTENT_W / strip.length
  const stripY = y + headH + boxH
  strip.forEach((field, index) => {
    const x = M + index * cellW
    doc.setDrawColor(...hexToRgb(INK))
    doc.setLineWidth(0.35)
    doc.rect(x, stripY, cellW, stripH)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...hexToRgb(INK))
    // Un intitulé long est replié pour ne pas déborder sur la case voisine.
    const titre = doc.splitTextToSize(`${field.label} :`, cellW - 6) as string[]
    doc.text(titre, x + 3, stripY + 4.5)
    const bas = stripY + 4.5 + (titre.length - 1) * 3.2

    const value = record.values[field.id]
    if (field.type === 'signature') {
      if (typeof value === 'string' && value.startsWith('data:image')) {
        try {
          doc.addImage(value, 'PNG', x + 3, bas + 1.5, cellW - 6, stripH - (bas - stripY) - 3)
        } catch {
          /* signature illisible : la case reste vide */
        }
      }
    } else if (field.type === 'checkbox') {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(value ? '[X]' : '[  ]', x + 3, bas + 6)
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text(show(value, field.type), x + 3, bas + 6)
    }
  })
  return stripY + stripH + 3
}

/** Attestation : la phrase type, complétée des valeurs saisies. */
function drawStatement(doc: jsPDF, section: SectionDef, record: FormRecord, y: number): number {
  const statement = section.statement
  if (!statement) return y

  const texte = statement.template.replace(/\{([a-z_]+)\}/gi, (_, id: string) => {
    const valeur = show(record.values[id]).trim()
    const blanc = statement.blanks.find((b) => b.id === id)
    // Un passage non renseigné garde les pointillés du formulaire papier.
    return valeur || '.'.repeat(Math.max(12, blanc?.size ?? 14))
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...hexToRgb(INK))
  const cadre = Boolean(statement.framed)
  const marge = cadre ? 20 : 14
  const lignes = doc.splitTextToSize(texte, CONTENT_W - marge) as string[]
  const hauteur = lignes.length * 7 + (cadre ? 22 : 10)

  if (y + hauteur > bottomLimit) {
    doc.addPage()
    y = M
  }

  if (cadre) {
    // Certificat : texte encadré, centré ou aligné à gauche selon le document.
    const gauche = statement.align === 'left'
    doc.setDrawColor(...hexToRgb(INK))
    doc.setLineWidth(0.7)
    doc.rect(M, y, CONTENT_W, hauteur)
    doc.text(lignes, gauche ? M + 8 : M + CONTENT_W / 2, y + 14, {
      align: gauche ? 'left' : 'center',
      lineHeightFactor: 1.6,
    })
    return y + hauteur + 6
  }

  doc.text(lignes, M + 7, y + 8, { lineHeightFactor: 1.6 })
  return y + hauteur + 6
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

  // Lignes de guidage, comme sur le formulaire papier : elles commencent
  // sous le texte pour ne pas le barrer.
  doc.setDrawColor(200, 208, 218)
  doc.setLineWidth(0.15)
  const debut = y + headH + (text.trim() ? 5 + lines.length * 3.8 : 7)
  for (let ly = debut; ly < y + headH + bodyH - 2; ly += 4.6) {
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
      doc.setFillColor(...pastel(choice.color))
      doc.rect(x, y, choiceW, h, 'F')
    }
    doc.setDrawColor(...hexToRgb(INK))
    doc.rect(x, y, choiceW, h)
    const textRgb: RGB = picked ? hexToRgb(INK) : hexToRgb(MUTED)
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

  const visas = signatures.slice(0, 3)
  const caseW = (CONTENT_W - GUTTER * (visas.length - 1)) / Math.max(1, visas.length)
  visas.forEach((field, index) => {
    const x = M + index * (caseW + GUTTER)
    doc.setDrawColor(...hexToRgb(INK))
    doc.setLineWidth(0.35)
    doc.setFillColor(...tint(form.accent))
    doc.rect(x, y, caseW, headH, 'FD')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...hexToRgb(INK))
    const intitule = doc.splitTextToSize(field.label, caseW - 4) as string[]
    doc.text(intitule[0], x + caseW / 2, y + 4.2, { align: 'center' })
    doc.rect(x, y + headH, caseW, boxH)

    const data = record.values[field.id]
    if (typeof data === 'string' && data.startsWith('data:image')) {
      try {
        doc.addImage(data, 'PNG', x + 3, y + headH + 2, caseW - 6, boxH - 8)
      } catch {
        /* signature illisible : la case reste vide */
      }
    }
    // Le nom porté sous une signature suit la convention « <champ>_name » ;
    // à défaut, la signature de l'équipage reprend le nom du candidat.
    const name = show(record.values[`${field.id}_name`]) || (field.id === 'sig_crew' ? show(record.values.name) : '')
    if (name) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...hexToRgb(MUTED))
      doc.text(name, x + 3, y + headH + boxH - 2.5)
    }
  })

  // Mention portée sous le visa : la qualité du signataire, par exemple.
  if (section.note) {
    const largeur = visas.length > 1 ? CONTENT_W : COL_W
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...hexToRgb(INK))
    const lignes = doc.splitTextToSize(section.note, largeur) as string[]
    doc.text(lignes, M + largeur / 2, y + headH + boxH + 4.5, { align: 'center' })
    return y + headH + boxH + 5 + lignes.length * 3.6
  }
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
        if (section.matrix) y = drawMatrix(doc, section.id, section.matrix, record, y, section.title)
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
        if (field) {
          y = drawBoxed(doc, form, field.label, show(record.values[field.id]), y, section.minHeight ?? 15)
        }
        break
      }
      case 'reference':
        y = drawReference(doc, form, section, y)
        break
      case 'statement':
        y = drawStatement(doc, section, record, y)
        break
      case 'checklist':
        if (y + 30 > bottomLimit && y > M + 30) {
          doc.addPage()
          y = M
        }
        y = drawChecklist(doc, form, section, record, y)
        break
      case 'endorsement':
        y = drawEndorsement(doc, form, section, record, y)
        break
      case 'divider':
        y = drawDivider(doc, section, y)
        break
      case 'answers':
        y = drawAnswers(doc, form, section, record, y)
        break
      case 'result':
        y = section.choiceRows
          ? drawChoiceRows(doc, form, section, record, y)
          : drawResult(doc, section, record, y)
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
