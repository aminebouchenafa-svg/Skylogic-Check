import type { FormDef } from '../types/form'
import { instructorClosing } from './instructor-common'
import { SCALE_SU } from './scales-instructor'
import { aircraftField } from './shared'

const item = (code: string, label: string) => ({ id: `i${code}`, code, label })

/**
 * INSTRUCTOR ASSESSMENT FORM — SIMULATOR — REF. D.O.A, § 13.1.16 a.
 *
 * Évaluation d'un instructeur en séance de simulateur : seize points notés
 * S / U / non observé, chacun pouvant porter sa remarque.
 */
export const instructorSimulatorForm: FormDef = {
  id: 'instructor-simulator',
  code: 'D.O.A — 13.1.16 a INSTRUCTOR ASSESSMENT FORM SIMULATOR',
  title: 'Instructor Simu',
  printTitle: 'Instructor Assessment Form — Simulator',
  subtitle: 'Évaluation d’instructeur en simulateur',
  category: 'Simulateur',
  revision: 'REF. D.O.A – Training Department',
  accent: '#B06BE0',
  icon: 'instructor',
  scaleId: SCALE_SU.id,
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
        {
          id: 'qualification',
          label: 'TRI / SFI',
          type: 'select',
          options: ['TRI', 'SFI'],
          required: true,
        },
        { id: 'licence', label: 'License Number', type: 'text' },
        aircraftField,
      ],
    },
    {
      id: 'items',
      title: 'Items',
      kind: 'grading',
      scaleId: SCALE_SU.id,
      itemRemarks: { label: 'Remarks', placeholder: 'Remarque sur cet item…' },
      items: [
        item('01', 'Content and technique of briefing'),
        item('02', 'Adequacy of pre-flight planning'),
        item('03', 'Supervision of session'),
        item('04', 'Operations of Simulator Instructor console'),
        item('05', 'Simulator Safety and Emergency Procedures'),
        item('06', 'Instructor’s knowledge of aircraft system'),
        item('07', 'Instructor’s knowledge of PAN OPS requirements'),
        item('08', 'Instructor’s knowledge of CRM/TEM assessment'),
        item(
          '09',
          'Instructor’s knowledge of all emergency and normal procedures, they are prohibited from ' +
            'practicing on aircraft training or checking whether revenue or base flight including pilot ' +
            'incapacitation',
        ),
        item('10', 'Instructor’s awareness of status of the Simulator motion, control, loading and visual system'),
        item('11', 'Content, technique, and quality of the session debriefing'),
        item('12', 'Assessment of the trainees’ system knowledge'),
        item('13', 'Instructor’s knowledge and standard of assessing the Test/Check'),
        item('14', 'Completion of Documentations'),
        item('15', 'Technical Log and Deferred Defects Log entries'),
        item('16', 'English level evaluation'),
      ],
    },
    ...instructorClosing(),
  ],
}
