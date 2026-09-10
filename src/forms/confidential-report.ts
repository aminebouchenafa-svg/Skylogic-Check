import type { FormDef } from '../types/form'

/**
 * CONFIDENTIAL REPORT — REF. D.O.A, Training Department.
 *
 * Rapport libre de l'instructeur sur un candidat. Pas de notation : une
 * identification, un visa, et une zone de commentaire qui occupe la page.
 */
export const confidentialReportForm: FormDef = {
  id: 'confidential-report',
  code: 'D.O.A — CONFIDENTIAL REPORT',
  title: 'Confidential Report',
  printTitle: 'Confidential Report',
  subtitle: 'Rapport confidentiel de l’instructeur',
  category: 'Remédiation',
  revision: 'REF. D.O.A – Training Department',
  accent: '#D98A2B',
  icon: 'confidential',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'staff_id', label: 'Staff ID', type: 'text' },
        { id: 'licence', label: 'License No', type: 'text' },
        { id: 'position', label: 'Position', type: 'select', options: ['CAPT', 'F/O', 'F/E'], required: true },
        { id: 'session', label: 'Session', type: 'text' },
        { id: 'date', label: 'Date', type: 'date', required: true },
      ],
    },
    {
      id: 'instructor',
      title: 'Instructor',
      kind: 'endorsement',
      fields: [
        { id: 'instructor_name', label: 'Instructor', type: 'text', width: 'half' },
        { id: 'instructor_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
    {
      id: 'comments',
      title: 'Comments',
      kind: 'notes',
      // Le rapport tient dans ce cadre : il occupe la page comme sur le papier.
      minHeight: 150,
      fields: [
        {
          id: 'comments',
          label: 'Comments',
          type: 'textarea',
          width: 'full',
          placeholder: 'Rapport de l’instructeur…',
        },
      ],
    },
  ],
}
