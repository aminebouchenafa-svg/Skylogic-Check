/**
 * Taille de police qui fait tenir un texte sur une seule ligne.
 *
 * La roue porte des noms de longueurs très inégales — « UPRT » et
 * « Training Requirement ». Plutôt qu'une taille unique, réglée sur le plus
 * long et donc minuscule, chacun prend la plus grande taille qui tient dans
 * sa case sans passer à la ligne.
 */

let pinceau: CanvasRenderingContext2D | null = null

/** Largeur du texte à 100 px, hors interlettrage. Mesurée une fois par texte. */
const mesures = new Map<string, number>()

function largeurA100(texte: string, police: string): number {
  const cle = `${police}|${texte}`
  const connu = mesures.get(cle)
  if (connu !== undefined) return connu
  if (!pinceau) pinceau = document.createElement('canvas').getContext('2d')
  if (!pinceau) return texte.length * 52
  pinceau.font = `600 100px ${police}`
  const largeur = pinceau.measureText(texte).width
  mesures.set(cle, largeur)
  return largeur
}

/**
 * @param largeur   place disponible, en pixels
 * @param espace    interlettrage en em (`letter-spacing` du style)
 * @param plancher  taille en dessous de laquelle on ne descend pas, quitte à
 *                  laisser le texte déborder un peu de sa case
 */
export function tailleQuiTient(
  texte: string,
  largeur: number,
  { max, plancher, espace = 0, police = 'Rajdhani, sans-serif' }:
    { max: number; plancher: number; espace?: number; police?: string },
): number {
  const t = texte.trim()
  if (!t) return max
  // Largeur du texte à la taille F : F × (largeur relative + interlettrage).
  const parEm = largeurA100(t, police) / 100 + espace * Math.max(0, t.length - 1)
  if (parEm <= 0) return max
  return Math.max(plancher, Math.min(max, largeur / parEm))
}
