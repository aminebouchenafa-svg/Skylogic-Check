/**
 * Thème jour / nuit.
 *
 * Le choix est porté par l'attribut `data-theme` de la page : toute la
 * feuille de style en dérive. Il est conservé sur l'appareil, comme le reste
 * des données de l'application.
 */

export type Theme = 'dark' | 'light'

const KEY = 'skylogic:theme:v1'

export function loadTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* stockage indisponible : le choix vaudra pour la session en cours */
  }
}
