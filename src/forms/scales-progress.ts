import type { GradeScale } from '../types/form'

/**
 * Barème du Confidential Assessment / Progress Report. Identique à l'échelle
 * courante, à ceci près qu'un 2 impose de repasser l'exercice et qu'il n'y a
 * pas de « non applicable ».
 */
export const SCALE_PROGRESS: GradeScale = {
  id: 'progress-5-1',
  name: 'Assessment ratings',
  // Pas de légende imprimée : le formulaire porte déjà son tableau « Ratings ».
  levels: [
    { value: '5', short: '5', label: 'Very Good', color: '#4E80ED' },
    { value: '4', short: '4', label: 'Good', color: '#52B685' },
    { value: '3', short: '3', label: 'Required Standard', color: '#E9A03D' },
    { value: '2', short: '2', label: 'Poor (Re-sit)', color: '#E87B36', failing: true },
    { value: '1', short: '1', label: 'Unsatisfactory', color: '#DB524C', failing: true },
  ],
}
