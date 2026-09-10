import type { SectionDef } from '../types/form'

/** Bloc commun aux deux évaluations d'instructeur : résultat, équipage, visa. */
export const instructorClosing = (): SectionDef[] => [
  {
    id: 'remarks',
    title: 'Remarks',
    subtitle: 'Mandatory for unsatisfactory items',
    kind: 'notes',
    minHeight: 32,
    fields: [
      {
        id: 'remarks',
        label: 'Remarks (Mandatory for unsatisfactory items)',
        type: 'textarea',
        width: 'full',
        placeholder: 'Faits observés, écarts constatés, suites à donner…',
      },
    ],
  },
  {
    id: 'result',
    title: 'Result of Assessment',
    kind: 'result',
    choices: [
      { value: 'Satisfactory', label: 'Satisfactory', color: '#52B685' },
      { value: 'Unsatisfactory', label: 'Unsatisfactory', color: '#DB524C' },
    ],
    fields: [{ id: 'result', label: 'Result of Assessment', type: 'text', required: true }],
  },
  {
    id: 'crew',
    title: 'Flight Crew Names',
    kind: 'endorsement',
    fields: [
      { id: 'crew_cpt', label: 'Cpt', type: 'text', width: 'third' },
      { id: 'crew_fo', label: 'F/O', type: 'text', width: 'third' },
      { id: 'examiner_name', label: 'Examiner Name', type: 'text', width: 'third' },
    ],
  },
  {
    id: 'examiner',
    title: 'Examiner',
    kind: 'signature',
    fields: [{ id: 'sig_examiner', label: 'Examiner Signature', type: 'signature', width: 'half' }],
  },
  {
    id: 'chief_pilot',
    title: 'Chief Pilot Training Comments',
    kind: 'endorsement',
    fields: [
      {
        id: 'cpt_comments',
        label: 'Chief Pilot Training Comments',
        type: 'textarea',
        width: 'full',
        placeholder: 'Avis du Chief Pilot Training…',
      },
      { id: 'cpt_sig', label: 'Signature', type: 'signature', width: 'half' },
      { id: 'cpt_date', label: 'Date', type: 'date', width: 'half' },
    ],
  },
]
