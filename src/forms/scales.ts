import type { GradeScale } from '../types/form'

/**
 * Échelles de notation. Le code couleur est unique dans toute l'application :
 * il est utilisé à l'écran, dans les statistiques et dans le PDF.
 */

export const SCALE_1_5: GradeScale = {
  id: 'scale-1-5',
  name: 'Échelle 1 à 5 (compétences)',
  allowNA: true,
  levels: [
    {
      value: '1',
      short: '1',
      label: 'Non satisfaisant',
      description: "Performance en dessous du standard, intervention nécessaire. Répétition requise.",
      color: '#E5383B',
      failing: true,
    },
    {
      value: '2',
      short: '2',
      label: 'Sous le standard',
      description: "Écarts constatés, corrigés après intervention. Entraînement complémentaire souhaitable.",
      color: '#F58A20',
      failing: true,
    },
    {
      value: '3',
      short: '3',
      label: 'Standard',
      description: 'Performance conforme au standard compagnie. Écarts mineurs détectés et corrigés.',
      color: '#22C1D6',
    },
    {
      value: '4',
      short: '4',
      label: 'Au-dessus du standard',
      description: 'Performance sûre et efficace, marge confortable, anticipation démontrée.',
      color: '#2FBF71',
    },
    {
      value: '5',
      short: '5',
      label: 'Exemplaire',
      description: 'Performance remarquable, pouvant servir de référence pédagogique.',
      color: '#E3B23C',
    },
  ],
}

export const SCALE_SU: GradeScale = {
  id: 'scale-su',
  name: 'Satisfaisant / Non satisfaisant',
  allowNA: true,
  levels: [
    {
      value: 'S',
      short: 'S',
      label: 'Satisfaisant',
      description: 'Exigence atteinte.',
      color: '#2FBF71',
    },
    {
      value: 'U',
      short: 'U',
      label: 'Non satisfaisant',
      description: 'Exigence non atteinte.',
      color: '#E5383B',
      failing: true,
    },
  ],
}

export const SCALES: Record<string, GradeScale> = {
  [SCALE_1_5.id]: SCALE_1_5,
  [SCALE_SU.id]: SCALE_SU,
}

export function getScale(id: string): GradeScale {
  return SCALES[id] ?? SCALE_1_5
}

export const NA_COLOR = '#5B6B85'
