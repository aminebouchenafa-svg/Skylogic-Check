import type { FormDef } from '../types/form'
import { aircraftField, POSITION_OPTIONS } from './shared'

const row = (id: string, label: string) => ({ id, label })

/**
 * LONG ABSENCE TRAINING FORM — REF. D.O.A, § 3.1.17.
 *
 * Programme de remise en ligne après une longue absence : trois jours de
 * rafraîchissement au sol, cinq séances de simulateur, puis huit secteurs
 * en ligne.
 */
export const longAbsenceForm: FormDef = {
  id: 'long-absence',
  code: 'D.O.A — 3.1.17 LONG ABSENCE TRAINING FORM',
  title: 'Long Absence',
  printTitle: 'Long Absence Training Form',
  subtitle: 'Remise en ligne après longue absence',
  category: 'Remédiation',
  revision: 'REF. D.O.A – Training Department',
  accent: '#C97BE0',
  icon: 'absence',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'name', label: 'Pilot Name', type: 'text', required: true },
        { id: 'position', label: 'Position', type: 'select', options: POSITION_OPTIONS, required: true },
        aircraftField,
        { id: 'licence', label: 'Licence Type and Number', type: 'text' },
      ],
    },
    {
      id: 'ground',
      title: 'Ground Refresher',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'date', label: 'Date', type: 'date' },
          { id: 'location', label: 'Location', type: 'text' },
          { id: 'trainee_sig', label: 'Trainee Signature', type: 'signature' },
        ],
        rows: [row('day_1', 'Day 1 *'), row('day_2', 'Day 2 *'), row('day_3', 'Day 3 *')],
        note: '(*) Ground refresher CBT — 8 hours/day.',
      },
    },
    {
      id: 'sim_location',
      title: 'Simulator Training',
      kind: 'identification',
      fields: [
        { id: 'sim_location', label: 'Simulator Training Location', type: 'text', width: 'full' },
      ],
    },
    {
      id: 'sessions',
      title: 'Simulator sessions',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'date', label: 'Date', type: 'date' },
          { id: 'cpt', label: 'CPT', type: 'checkbox' },
          { id: 'fo', label: 'FO', type: 'checkbox' },
          { id: 'instructor', label: 'Instructor Name & Comments', type: 'text' },
        ],
        rows: [
          row('session_1', 'Session 1'),
          row('session_2', 'Session 2'),
          row('session_3', 'Session 3'),
          row('session_4', 'Session 4'),
          row('session_5', 'Session 5'),
        ],
      },
    },
    {
      id: 'line',
      title: 'Line Training',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'date', label: 'Date', type: 'date' },
          { id: 'reg', label: 'A/C REG', type: 'text' },
          { id: 'dep_arr', label: 'DEP / ARR', type: 'text' },
          { id: 'instructor', label: 'Instructor Name & Comments', type: 'text' },
        ],
        rows: [
          row('sector_1', 'Sector 1'),
          row('sector_2', 'Sector 2'),
          row('sector_3', 'Sector 3'),
          row('sector_4', 'Sector 4'),
          row('sector_5', 'Sector 5'),
          row('sector_6', 'Sector 6'),
          row('sector_7', 'Sector 7'),
          row('sector_8', 'Sector 8'),
        ],
      },
    },
  ],
}
