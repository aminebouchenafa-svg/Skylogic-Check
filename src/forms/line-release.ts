import type { FormDef } from '../types/form'
import { REMINDER_LINE } from './scales'
import { aircraftField, aircraftRegField, remarksSection } from './shared'
import { AIRPORTS } from './network'

/**
 * LINE RELEASE FORM — REF. D.O.A, § 13.1.15.
 *
 * Lâcher en ligne : la confirmation que le contrôle final est acquis, les
 * étapes servant de référence, puis les trois visas — TRI, Fleet Training
 * Manager et Chief Pilot Training.
 */
export const lineReleaseForm: FormDef = {
  id: 'line-release',
  code: 'D.O.A — 13.1.15 LINE RELEASE FORM',
  title: 'Line Release',
  printTitle: 'Line Release Form',
  subtitle: 'Lâcher en ligne après contrôle final',
  category: 'Ligne',
  revision: 'REF. D.O.A – Training Department',
  accent: '#17AE96',
  icon: 'release',
  scaleId: 'ah-5-1',
  reminder: REMINDER_LINE,
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        {
          id: 'position',
          label: 'Captain / First Officer',
          type: 'select',
          options: ['Captain', 'First Officer'],
          required: true,
        },
        { id: 'name', label: 'Name', type: 'text', required: true },
        aircraftField,
        { ...aircraftRegField, width: 'full' },
      ],
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      kind: 'statement',
      statement: {
        framed: true,
        align: 'left',
        template:
          'This is to confirm that Captain / First Officer (*)  Name : {name}\n' +
          'Satisfactorily completed his final Route/Line Check and can be scheduled for flights\n' +
          'as a {position} (*) on the following\n' +
          'A/C Type : {aircraft_type}      A/C REG : {aircraft_reg}\n' +
          'Into key area’s and/or airports for which the proper qualification has been obtained.',
        blanks: [
          { id: 'name', label: 'Nom', size: 26, readOnly: true },
          { id: 'position', label: 'Fonction', size: 14, readOnly: true },
          { id: 'aircraft_type', label: 'Type', size: 14, readOnly: true },
          { id: 'aircraft_reg', label: 'Immatriculation', size: 12, readOnly: true },
        ],
      },
    },
    {
      id: 'legs',
      title: 'Line release control',
      subtitle: 'At least one (01) leg as PF and one (01) leg as PM',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        columns: [
          { id: 'duty', label: '* DUTY', type: 'select', options: ['PF', 'PM'] },
          { id: 'flight', label: 'FLT Number', type: 'text', prefix: 'AH', keyboard: 'numeric' },
          { id: 'from', label: 'FROM', type: 'text', suggestions: AIRPORTS, uppercase: true },
          { id: 'to', label: 'TO', type: 'text', suggestions: AIRPORTS, uppercase: true },
        ],
        rows: [
          { id: 'leg_1', label: '' },
          { id: 'leg_2', label: '' },
        ],
        note: '(*) Cross-out inapplicable item.',
      },
    },
    {
      id: 'release',
      title: 'Release',
      note: 'Initial area(s) airport(s) : All CAT A Airfields within AIR ALGERIE network.',
      kind: 'endorsement',
      fields: [{ id: 'release_date', label: 'Date', type: 'date', width: 'half', required: true }],
    },
    remarksSection(false),
    {
      id: 'signatures',
      title: 'Signatures',
      subtitle: 'Signature électronique des trois autorités',
      kind: 'signature',
      fields: [
        { id: 'sig_tri', label: 'TRI', type: 'signature', width: 'third' },
        { id: 'sig_ftm', label: 'Fleet Training Manager', type: 'signature', width: 'third' },
        { id: 'sig_cpt', label: 'Chief Pilot Training', type: 'signature', width: 'third' },
      ],
    },
  ],
}
