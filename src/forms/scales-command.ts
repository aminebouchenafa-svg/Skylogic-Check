import type { GradeScale } from '../types/form'
import { NA_LEVEL } from './na'

/**
 * Command Ability Grading — barème propre à l'évaluation en vue du lâcher
 * commandant de bord. Mêmes notes et mêmes couleurs que l'échelle courante,
 * mais des définitions différentes, détaillées au dos du formulaire.
 */
export const SCALE_COMMAND: GradeScale = {
  id: 'command-5-1',
  name: 'Command Ability Grading',
  legend:
    '5 = Ideal performance · 4 = Good potential · 3 = Satisfactory for the stage · ' +
    '2 = Below the required standard · 1 = Not suitable for Command · / = Not Applicable',
  na: NA_LEVEL,
  levels: [
    {
      value: '5',
      short: '5',
      label: 'Ideal performance',
      description: 'Conduit et gère l’équipage, anticipe, décide. Aucune difficulté attendue en stage de lâcher.',
      color: '#4E80ED',
    },
    {
      value: '4',
      short: '4',
      label: 'Good potential',
      description: 'Objectif atteint avec de très légers écarts. Apte à entreprendre un stage de lâcher.',
      color: '#52B685',
    },
    {
      value: '3',
      short: '3',
      label: 'Satisfactory for the stage',
      description: 'Écarts mineurs fréquents mais aucun écart majeur. Constituerait un risque en stage de lâcher.',
      color: '#E9A03D',
    },
    {
      value: '2',
      short: '2',
      label: 'Below the required standard',
      description: 'Écart majeur occasionnel. Passerait difficilement un stage de lâcher, même avec entraînement.',
      color: '#E87B36',
      failing: true,
    },
    {
      value: '1',
      short: '1',
      label: 'Not suitable for Command',
      description: 'Objectif non atteint, intervention du commandant nécessaire. Non retenu pour le commandement.',
      color: '#DB524C',
      failing: true,
    },
  ],
}
