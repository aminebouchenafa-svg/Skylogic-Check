import type { FormValues, MatrixDef } from '../types/form'
import { cellId } from './ids'

/**
 * Totaux d'un tableau.
 *
 * Une colonne peut porter des nombres (secteurs) ou des durées écrites
 * « h:mm » ou « hh mm » (temps de vol). Le total suit la nature de la colonne :
 * une somme simple d'un côté, un cumul heures/minutes de l'autre.
 */

/** Reconnaît une durée « 1:30 », « 1h30 », « 1 30 ». */
const DUREE = /^(\d{1,3})\s*[:hH ]\s*([0-5]?\d)$/

export function parseDuration(text: string): number | null {
  const t = text.trim()
  if (!t) return null
  const m = DUREE.exec(t)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

/**
 * Total d'une colonne, toutes lignes saisies confondues. Renvoie une chaîne
 * vide quand rien n'est saisi, pour ne pas afficher un zéro trompeur.
 */
export function columnTotal(
  id: string,
  matrix: MatrixDef,
  columnId: string,
  values: FormValues,
): string {
  let minutes = 0
  let nombre = 0
  let duree = false
  let saisi = false

  for (const row of matrix.rows) {
    if (row.computed) continue
    const brut = values[cellId(id, row.id, columnId)]
    const texte = brut === null || brut === undefined ? '' : String(brut).trim()
    if (!texte) continue

    const enMinutes = parseDuration(texte)
    if (enMinutes !== null) {
      minutes += enMinutes
      duree = true
      saisi = true
      continue
    }
    const valeur = Number(texte.replace(',', '.'))
    if (Number.isFinite(valeur)) {
      nombre += valeur
      saisi = true
    }
  }

  if (!saisi) return ''
  if (duree) return formatDuration(minutes + Math.round(nombre * 60))
  return String(Number(nombre.toFixed(2)))
}
