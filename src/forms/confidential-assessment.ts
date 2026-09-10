import type { FormDef } from '../types/form'
import { SCALE_PROGRESS } from './scales-progress'

const item = (id: string, label: string) => ({ id, label })

/**
 * CONFIDENTIAL ASSESSMENT / PROGRESS REPORT — REF. D.O.A, Training Department.
 *
 * Bilan d'étape sur cinq domaines. Sur le papier, les colonnes 1 à 5 sont les
 * notes elles-mêmes : l'instructeur coche la case du niveau retenu. À l'écran
 * la notation reste une pastille par ligne, et l'impression restitue la
 * grille d'origine (« gradeLayout: grid »).
 */
export const confidentialAssessmentForm: FormDef = {
  id: 'confidential-assessment',
  code: 'D.O.A — CONFIDENTIAL ASSESSMENT',
  title: 'Progress Report',
  printTitle: 'Confidential Assessment / Progress Report',
  subtitle: 'Bilan d’étape du stagiaire',
  category: 'Remédiation',
  revision: 'REF. D.O.A – Training Department',
  accent: '#3AA0FF',
  icon: 'progress',
  scaleId: SCALE_PROGRESS.id,
  sections: [
    {
      id: 'ratings',
      title: 'Ratings',
      kind: 'reference',
      referenceRows: SCALE_PROGRESS.levels.map((level) => ({
        label: level.short,
        description: level.label,
        color: level.color,
      })),
    },
    {
      id: 'trainee',
      title: 'Trainee',
      kind: 'identification',
      fields: [
        { id: 'position', label: 'Trainee', type: 'select', options: ['CAPT', 'F/O', 'F/E'], required: true },
        { id: 'name', label: 'Name', type: 'text', required: true },
      ],
    },
    {
      id: 'assessment',
      title: 'Assessment',
      kind: 'grading',
      scaleId: SCALE_PROGRESS.id,
      gradeLayout: 'grid',
      items: [
        item('general_handling', 'General Handling'),
        item('instrument_flying', 'Instrument Flying'),
        item('operating_procedures', 'Operating Procedures'),
        item('technical_knowledge', 'Technical Knowledge'),
        item('crm_tem', 'CRM / TEM'),
      ],
    },
    {
      id: 'details',
      title: 'Exercise',
      kind: 'identification',
      fields: [
        { id: 'exercise', label: 'Exercise / Route', type: 'text', width: 'half' },
        { id: 'supporting_crew', label: 'Supporting Crew', type: 'text', width: 'half' },
      ],
    },
    {
      id: 'instructor',
      title: 'Instructor',
      kind: 'endorsement',
      fields: [
        { id: 'instructor_name', label: 'Instructor’s Name', type: 'text', width: 'third' },
        { id: 'instructor_sig', label: 'Signature', type: 'signature', width: 'third' },
        { id: 'instructor_date', label: 'Date', type: 'date', width: 'third', required: true },
      ],
    },
    {
      id: 'narrative',
      title: 'Narrative',
      kind: 'notes',
      // Le narratif occupe le bas de la page sur le document d'origine.
      minHeight: 100,
      fields: [
        {
          id: 'narrative',
          label: 'Narrative',
          type: 'textarea',
          width: 'full',
          placeholder: 'Compte rendu détaillé de la séance…',
        },
      ],
    },
  ],
}
