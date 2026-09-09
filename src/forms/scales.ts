import type { GradeLevel, GradeScale } from '../types/form'

/**
 * Échelle de notation officielle Air Algérie, reprise telle quelle des
 * formulaires du Training Department :
 * 5 = Very Good, 4 = Good, 3 = Required Standard, 2 = Poor,
 * 1 = Unsatisfactory, / = Not Applicable.
 *
 * Le code couleur est unique dans toute l'application : écran, indicateurs et PDF.
 */

export const NA_LEVEL: GradeLevel = {
  value: 'NA',
  short: '/',
  label: 'Not Applicable',
  description: 'Item non applicable à cette séance.',
  color: '#5B6B85',
}

export const SCALE_AH: GradeScale = {
  id: 'ah-5-1',
  name: 'Grading Air Algérie (5 → 1)',
  legend: '5 = Very Good · 4 = Good · 3 = Required Standard · 2 = Poor · 1 = Unsatisfactory · / = Not Applicable',
  na: NA_LEVEL,
  levels: [
    {
      value: '5',
      short: '5',
      label: 'Very Good',
      description: 'Performance remarquable, pouvant servir de référence.',
      color: '#4E80ED',
    },
    {
      value: '4',
      short: '4',
      label: 'Good',
      description: 'Performance sûre et efficace, marge confortable.',
      color: '#52B685',
    },
    {
      value: '3',
      short: '3',
      label: 'Required Standard',
      description: 'Standard exigé atteint.',
      color: '#E9A03D',
    },
    {
      value: '2',
      short: '2',
      label: 'Poor',
      description: 'En dessous du standard exigé. Remarque obligatoire.',
      color: '#E87B36',
      failing: true,
    },
    {
      value: '1',
      short: '1',
      label: 'Unsatisfactory',
      description: 'Non satisfaisant. Remarque obligatoire et suite à donner.',
      color: '#DB524C',
      failing: true,
    },
  ],
}

export const SCALES: Record<string, GradeScale> = {
  [SCALE_AH.id]: SCALE_AH,
}

export function getScale(id: string): GradeScale {
  return SCALES[id] ?? SCALE_AH
}

/** Tous les niveaux sélectionnables, « / » compris. */
export function selectableLevels(scale: GradeScale): GradeLevel[] {
  return scale.na ? [...scale.levels, scale.na] : scale.levels
}

export function findLevel(scale: GradeScale, value: string): GradeLevel | undefined {
  return selectableLevels(scale).find((l) => l.value === value)
}

export const RESULT_CHOICES = [
  { value: 'Satisfactory', label: 'Satisfactory', color: '#52B685' },
  { value: 'Unsatisfactory', label: 'Unsatisfactory', color: '#DB524C' },
]

export const REMINDER_LINE =
  'Emergency simulations and non-normal situations (system/engine failures, pilot incapacitation, ' +
  'maneuvers) are strictly prohibited on revenue flights. Emergency and Abnormal will be addressed on ' +
  'the ground via briefing and questions only. Violation is considered a serious safety breach and may ' +
  'result in removal from training and disciplinary action.'
