import type { FormDef } from '../types/form'

const tick = (id: string, label: string) => ({ id, label })

/** Colonnes communes aux trois blocs de formation du document. */
const sessionColumns = [
  { id: 'hours', label: 'Hours', type: 'text' as const },
  { id: 'date', label: 'Date', type: 'date' as const },
  { id: 'location', label: 'Location', type: 'text' as const },
  { id: 'tri_name', label: 'TRI Name', type: 'text' as const },
  { id: 'tri_sig', label: 'TRI Signature', type: 'signature' as const },
]

/**
 * UPRT INITIAL QUALIFICATION RECORD — REF. D.O.A, AH DOA FPNT/ED01/REV00/2024.
 *
 * Qualification initiale à la prévention et à la récupération des situations
 * inusuelles : formation au sol, séance simulateur avec la liste des
 * manœuvres exigées, RHS pour les commandants, puis formation instructeur.
 */
export const uprtQualificationForm: FormDef = {
  id: 'uprt-qualification',
  code: 'D.O.A — UPRT INITIAL QUALIFICATION RECORD',
  title: 'UPRT',
  printTitle: 'UPRT Initial Qualification Record',
  subtitle: 'Upset Prevention & Recovery Training',
  category: 'Simulateur',
  revision: 'AH DOA FPNT/ED01/REV00/2024',
  accent: '#E08B4B',
  icon: 'uprt',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      pairsPerRow: 2,
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true },
        {
          id: 'position',
          label: 'Position',
          type: 'select',
          options: ['TRI', 'Captain', 'F/O'],
          required: true,
        },
        { id: 'licence', label: 'Licence Type & Nbr', type: 'text' },
        { id: 'staff_id', label: 'Staff ID', type: 'text' },
        {
          id: 'aircraft_type',
          label: 'A/C Type',
          type: 'select',
          options: ['ATR 72', 'B737-NG', 'A330'],
          required: true,
        },
      ],
    },
    {
      id: 'ground',
      title: 'Ground Training',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        columns: [
          {
            id: 'kind',
            label: 'Type of Ground training',
            type: 'select',
            options: ['E-learning', 'Classroom'],
          },
          ...sessionColumns,
        ],
        rows: [{ id: 'session', label: '' }],
        note: 'Durée de référence : 06H00.',
      },
    },
    {
      id: 'simulator',
      title: 'Simulator Flight Training',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        columns: [
          { id: 'level', label: 'Simulator Level', type: 'select', options: ['Level D'] },
          ...sessionColumns,
        ],
        rows: [{ id: 'session', label: '' }],
      },
    },
    {
      id: 'manoeuvres',
      title: 'Manœuvres',
      subtitle: 'Cocher chaque exercice conduit en séance',
      kind: 'checklist',
      tickColumns: [{ id: 'done', label: 'Done', mark: 'X', color: '#52B685' }],
      items: [
        tick('manual_high', 'Manual flight at high altitude (NORMAL, ALT & DIRECT LAW for FBW)'),
        tick('manual_low', 'Manual flight at low altitude (NORMAL, ALT & DIRECT LAW for FBW)'),
        tick('stall_low', 'Stall at low altitude'),
        tick('stall_high', 'Stall at high altitude'),
        tick('bounced', 'Bounced landing'),
        tick('overspeed', 'Over speed prevention & recovery'),
        tick('nose_high_high', 'Nose high unusual attitude at high altitude with and without bank'),
        tick('nose_high_low', 'Nose high unusual attitude at low altitude with and without bank'),
        tick('nose_low_high', 'Nose low unusual attitude at high altitude with and without bank'),
        tick('nose_low_low', 'Nose low unusual attitude at low altitude with and without bank'),
      ],
    },
    {
      id: 'rhs',
      title: 'RHS for Captains',
      kind: 'checklist',
      tickColumns: [{ id: 'done', label: 'Done', mark: 'X', color: '#52B685' }],
      items: [tick('rhs_stall', 'Stall manœuvre'), tick('rhs_upset', 'Upset recovery situation')],
    },
    {
      id: 'instructor',
      title: 'Instructor Training',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        columns: [
          { id: 'level', label: 'Simulator Level', type: 'select', options: ['Level D'] },
          ...sessionColumns,
        ],
        rows: [{ id: 'session', label: '' }],
      },
    },
    {
      id: 'panel',
      title: 'Panel operator training',
      kind: 'checklist',
      tickColumns: [{ id: 'done', label: 'Done', mark: 'X', color: '#52B685' }],
      items: [tick('panel_operator', 'Panel operator training')],
    },
    {
      id: 'comments',
      title: 'Comments',
      kind: 'notes',
      minHeight: 26,
      fields: [
        {
          id: 'comments',
          label: 'Comments',
          type: 'textarea',
          width: 'full',
          placeholder: 'Observations de l’instructeur…',
        },
      ],
    },
    {
      id: 'result',
      title: 'Result',
      kind: 'result',
      choices: [
        { value: 'Satisfactory', label: 'Satisfactory', color: '#52B685' },
        { value: 'Remedial', label: 'Remedial Action Required', color: '#E87B36' },
      ],
      fields: [{ id: 'result', label: 'Result', type: 'text', required: true }],
    },
    {
      id: 'signatures',
      title: 'Signatures',
      subtitle: 'Signature électronique',
      kind: 'signature',
      fields: [
        { id: 'sig_trainee', label: 'Trainee Signature', type: 'signature', width: 'half' },
        { id: 'sig_cpt', label: 'Chief Pilot Training', type: 'signature', width: 'half' },
      ],
    },
  ],
}
