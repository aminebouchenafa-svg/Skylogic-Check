import type { FormDef } from '../types/form'
import { instructorClosing } from './instructor-common'
import { REMINDER_LINE } from './scales'
import { SCALE_SU } from './scales-instructor'
import { aircraftField } from './shared'

const item = (code: string, label: string) => ({ id: `i${code}`, code, label })

/** Une étape de qualification : n° de vol, provenance, destination. */
const legColumns = [
  { id: 'flt_a', label: 'FLT Nbr', type: 'text' as const, prefix: 'AH' },
  { id: 'from_a', label: 'FROM', type: 'text' as const },
  { id: 'to_a', label: 'TO', type: 'text' as const },
  { id: 'flt_b', label: 'FLT Nbr', type: 'text' as const, prefix: 'AH' },
  { id: 'from_b', label: 'FROM', type: 'text' as const },
  { id: 'to_b', label: 'TO', type: 'text' as const },
]

/**
 * INSTRUCTOR ASSESSMENT FORM — FLIGHT — REF. D.O.A, § 13.1.16 b.
 *
 * Évaluation d'un instructeur en vol : les étapes effectuées de chaque siège,
 * puis douze points notés S / U / non observé, chacun pouvant porter sa
 * remarque.
 */
export const instructorFlightForm: FormDef = {
  id: 'instructor-flight',
  code: 'D.O.A — 13.1.16 b INSTRUCTOR ASSESSMENT FORM FLIGHT',
  title: 'Instructor Vol',
  printTitle: 'Instructor Assessment Form — Flight',
  subtitle: 'Évaluation d’instructeur en vol',
  category: 'Ligne',
  revision: 'REF. D.O.A – Training Department',
  accent: '#8A6BE0',
  icon: 'instructor',
  scaleId: SCALE_SU.id,
  reminder: REMINDER_LINE,
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'date', label: 'Date', type: 'date', required: true },
        { id: 'name', label: 'Candidate Name', type: 'text', required: true },
        {
          id: 'assessment_type',
          label: 'Initial / Renewal',
          type: 'select',
          options: ['Initial', 'Renewal'],
          required: true,
        },
        { id: 'licence', label: 'License Nbr', type: 'text' },
        aircraftField,
        { id: 'aircraft_reg', label: 'Aircraft Registration', type: 'text' },
      ],
    },
    {
      id: 'lhs',
      title: 'Left hand seat legs',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        columns: legColumns,
        rows: [{ id: 'leg_1', label: '' }, { id: 'leg_2', label: '' }, { id: 'leg_3', label: '' }],
        note: '(*) Mandatory for new TRI not previously qualified.',
      },
    },
    {
      id: 'rhs',
      title: 'Right hand seat legs',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        columns: legColumns,
        rows: [{ id: 'leg_1', label: '' }],
      },
    },
    {
      id: 'items',
      title: 'Items',
      kind: 'grading',
      scaleId: SCALE_SU.id,
      itemRemarks: { label: 'Remarks', placeholder: 'Remarque sur cet item…' },
      items: [
        item('01', 'Content and technique of briefing'),
        item('02', 'Adequacy of pre-flight preparation'),
        item('03', 'Supervision of the flight'),
        item('04', 'Use of documents'),
        item('05', 'Instructor’s knowledge of aircraft system'),
        item('06', 'Instructor’s knowledge of CRM/TEM assessment'),
        item(
          '07',
          'Instructor’s knowledge of all emergency and normal procedures, they are prohibited from ' +
            'practicing on aircraft training or checking whether revenue or base flight including pilot ' +
            'incapacitation',
        ),
        item('08', 'Content and technique of instruction'),
        item('09', 'Assessment of the trainee system knowledge'),
        item('10', 'Instructor flight Debriefing and standard of assessing the flight'),
        item('11', 'Completion of documentations'),
        item('12', 'English level evaluation'),
      ],
    },
    ...instructorClosing(),
  ],
}
