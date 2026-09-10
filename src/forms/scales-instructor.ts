import type { GradeScale } from '../types/form'
import { NA_LEVEL } from './na'

/**
 * Barème des évaluations d'instructeur : satisfaisant, non satisfaisant, ou
 * non observé. Pas de note chiffrée, donc pas de moyenne.
 */
export const SCALE_SU: GradeScale = {
  id: 'su-2',
  name: 'Instructor assessment',
  legend: 'S = Satisfactory · U = Unsatisfactory · / = Not observed',
  na: { ...NA_LEVEL, label: 'Not observed', description: 'Item non observé pendant la séance.' },
  levels: [
    {
      value: 'S',
      short: 'S',
      label: 'Satisfactory',
      description: 'Standard attendu de l’instructeur atteint.',
      color: '#52B685',
    },
    {
      value: 'U',
      short: 'U',
      label: 'Unsatisfactory',
      description: 'Non satisfaisant. Remarque obligatoire.',
      color: '#DB524C',
      failing: true,
    },
  ],
}
