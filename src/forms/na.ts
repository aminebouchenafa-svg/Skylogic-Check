import type { GradeLevel } from '../types/form'

/** Niveau « non applicable », commun à toutes les échelles. */
export const NA_LEVEL: GradeLevel = {
  value: 'NA',
  short: '/',
  label: 'Not Applicable',
  description: 'Item non applicable à cette séance.',
  color: '#5B6B85',
}
