import type { FormDef } from '../types/form'
import { REMINDER_LINE } from './scales'
import { aircraftField, POSITION_OPTIONS } from './shared'

/** Intitulé du programme, repris à l'identique sur chaque tableau du document. */
const PROGRAMME = 'ETOPS (EDTO) / MNPS (NAT-HLA) / RVSM / PBCS'

const resultColumn = {
  id: 'result',
  label: 'Exam Result',
  type: 'select' as const,
  options: ['Satisfactory', 'Unsatisfactory'],
}

const triColumns = [
  { id: 'tri_name', label: 'TRI Name', type: 'text' as const },
  { id: 'tri_sig', label: 'TRI Signature', type: 'signature' as const },
]

/**
 * ETOPS (EDTO) / MNPS (NAT-HLA) / RVSM / PBCS TRAINING RECORD — REF. D.O.A,
 * § 13.1.14.
 *
 * Relevé complet d'une qualification : école au sol, simulateur, vols en
 * ligne étape par étape, contrôle final, puis le certificat de lâcher signé
 * par le Chief Pilot / Fleet Training Manager.
 */
export const etopsRecordForm: FormDef = {
  id: 'etops-record',
  code: 'D.O.A — 13.1.14 ETOPS / MNPS / RVSM / PBCS TRAINING RECORD',
  title: 'ETOPS / RVSM',
  printTitle: 'ETOPS (EDTO) / MNPS (NAT-HLA) / RVSM / PBCS Training Record',
  subtitle: 'École au sol, simulateur, ligne et lâcher',
  category: 'Examen',
  revision: 'REF. D.O.A – Training Department',
  accent: '#2F6FE0',
  icon: 'etops',
  scaleId: 'ah-5-1',
  reminder: REMINDER_LINE,
  sections: [
    {
      id: 'identification',
      title: 'Ground School',
      kind: 'identification',
      fields: [
        { id: 'position', label: 'CPT / FO', type: 'select', options: POSITION_OPTIONS, required: true },
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'licence', label: 'Licence Nb', type: 'text' },
        aircraftField,
      ],
    },
    {
      id: 'ground',
      title: 'Ground Training',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'date', label: 'Date', type: 'date' },
          resultColumn,
          ...triColumns,
        ],
        rows: [{ id: 'etops', label: PROGRAMME }],
      },
    },
    {
      id: 'simulator',
      title: 'Simulator Training',
      subtitle: 'Training completed',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'date', label: 'Date', type: 'date' },
          resultColumn,
          ...triColumns,
        ],
        rows: [
          { id: 'session_1', label: PROGRAMME },
          { id: 'session_2', label: '' },
        ],
      },
    },
    {
      id: 'line',
      title: 'Line Training',
      subtitle: PROGRAMME,
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'date', label: 'Date', type: 'date' },
          { id: 'route', label: 'Route', type: 'text', prefix: 'AH', keyboard: 'numeric' },
          { id: 'pf', label: 'PF', type: 'checkbox' },
          { id: 'pm', label: 'PM', type: 'checkbox' },
          ...triColumns,
        ],
        rows: [
          { id: 'leg_1', label: 'LEG 1' },
          { id: 'leg_2', label: 'LEG 2' },
          { id: 'leg_3', label: 'LEG 3' },
          { id: 'leg_4', label: 'LEG 4' },
        ],
        note: 'At least one (01) leg as PF and one (01) leg as PM.',
      },
    },
    {
      id: 'result',
      title: 'Check',
      subtitle: PROGRAMME,
      kind: 'result',
      choices: [
        { value: 'Satisfactory', label: 'Satisfactory', color: '#52B685' },
        { value: 'Unsatisfactory', label: 'Unsatisfactory', color: '#DB524C' },
      ],
      fields: [{ id: 'result', label: 'Check result', type: 'text', required: true }],
    },
    {
      id: 'check_tri',
      title: 'Check TRI',
      kind: 'endorsement',
      fields: [
        { id: 'check_tri_name', label: 'TRI Name', type: 'text', width: 'half' },
        { id: 'check_tri_sig', label: 'TRI Signature', type: 'signature', width: 'half' },
      ],
    },
    {
      id: 'clearance',
      title: 'Clearance Certificate',
      kind: 'statement',
      statement: {
        framed: true,
        template:
          'ETOPS (EDTO) / MNPS (NAT-HLA) / RVSM / PBCS CLEARANCE CERTIFICATE\n\n' +
          'Captain / FO {name} is cleared to operate as {cleared_as}\n\n' +
          'On AIR ALGERIE routes using ETOPS (EDTO) / MNPS (NAT-HLA) / RVSM / PBCS procedures.',
        blanks: [
          { id: 'name', label: 'Nom du pilote', size: 26, readOnly: true },
          { id: 'cleared_as', label: 'CPT / F/O', size: 10, required: true },
        ],
      },
    },
    {
      id: 'signed',
      title: 'Signed',
      note: 'Chief Pilot / Fleet Training Manager / Chief Pilot Training',
      kind: 'endorsement',
      fields: [
        { id: 'signed_sig', label: 'Signed', type: 'signature', width: 'half' },
        { id: 'signed_date', label: 'Date', type: 'date', width: 'half', required: true },
      ],
    },
  ],
}
