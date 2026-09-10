import type { FormDef } from '../types/form'

/**
 * CAT "C" AIRFIELD TRAINING RECORD — REF. D.O.A, Training Department.
 *
 * Relevé de qualification à un terrain de catégorie C : les trois segments de
 * formation visés par leur instructeur, puis un volet détachable destiné au
 * Crew Office.
 */
export const catCAirfieldForm: FormDef = {
  id: 'cat-c-airfield',
  code: 'D.O.A — CAT C AIRFIELD TRAINING RECORD',
  title: 'CAT “C” Airfield',
  printTitle: 'CAT “C” Airfield Training Record',
  subtitle: 'Qualification à un terrain de catégorie C',
  category: 'Examen',
  revision: 'REF. D.O.A – Training Department',
  accent: '#17AE96',
  icon: 'airfield',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'airfield', label: 'Airfield', type: 'text', width: 'full', required: true, placeholder: 'DAAG' },
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'staff_id', label: 'Staff ID', type: 'text' },
        { id: 'position', label: 'Position', type: 'select', options: ['CAPT', 'F/O'], required: true },
        { id: 'licence', label: 'License No', type: 'text' },
      ],
    },
    {
      id: 'segments',
      title: 'Training segments',
      subtitle: 'Chaque segment est visé par son instructeur',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'instructor', label: "Instructor's Name", type: 'text' },
          { id: 'signature', label: "Instructor's Signature", type: 'signature' },
          { id: 'completed', label: 'Completion Date', type: 'date' },
        ],
        rows: [
          { id: 'ground', label: 'Ground Training' },
          { id: 'simulator', label: 'Simulator Training' },
          { id: 'line', label: 'Line Training' },
        ],
      },
    },
    {
      id: 'tm',
      title: 'Training Manager',
      kind: 'endorsement',
      fields: [
        { id: 'tm_sig', label: 'TM Signature', type: 'signature', width: 'half' },
        { id: 'tm_date', label: 'Date', type: 'date', width: 'half' },
      ],
    },
    {
      id: 'cut',
      title: '',
      kind: 'divider',
    },
    {
      id: 'crew_office',
      title: 'For Crew Office',
      note:
        'I confirm that the below mentioned crew member has completed the requirements for ' +
        'CAT ‘C’ Airfield Training.',
      kind: 'endorsement',
      fields: [
        { id: 'crew_name', label: 'Name', type: 'text', width: 'quarter' },
        { id: 'crew_staff', label: 'Staff ID', type: 'text', width: 'quarter' },
        { id: 'crew_position', label: 'Position', type: 'select', options: ['CAPT', 'F/O'], width: 'quarter' },
        { id: 'crew_licence', label: 'License No', type: 'text', width: 'quarter' },
      ],
    },
    {
      id: 'crew_tm',
      title: 'Training Manager',
      kind: 'endorsement',
      fields: [
        { id: 'crew_tm_sig', label: 'TM Signature', type: 'signature', width: 'half' },
        { id: 'crew_tm_date', label: 'Date', type: 'date', width: 'half' },
      ],
    },
  ],
}
