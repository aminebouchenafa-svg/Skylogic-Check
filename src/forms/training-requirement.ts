import type { FormDef } from '../types/form'

const item = (id: string, label: string) => ({ id, label })

/**
 * TRAINING REQUIREMENT RECORD — REF. D.O.A, Training Department.
 *
 * Relevé des formations exigées pour un stage de transition, de lâcher
 * commandant, de conversion ou d'entrée : chaque ligne est requise ou non,
 * avec sa date d'effet ou de réalisation.
 */
export const trainingRequirementForm: FormDef = {
  id: 'training-requirement',
  code: 'D.O.A — TRAINING REQUIREMENT RECORD',
  title: 'Training Requirement',
  printTitle: 'Training Requirement Record',
  subtitle: 'Transition / Command / Conversion / Entry',
  category: 'Examen',
  revision: 'REF. D.O.A – Training Department',
  accent: '#E8B93B',
  icon: 'syllabus',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      pairsPerRow: 3,
      fields: [
        { id: 'position', label: 'Position', type: 'select', options: ['CAPT', 'F/O', 'F/E'], required: true },
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'course_no', label: 'Course No', type: 'text' },
        { id: 'licence', label: 'Licence No', type: 'text' },
        { id: 'start_date', label: 'Start Date', type: 'date', required: true },
        {
          id: 'fleet',
          label: 'Fleet',
          type: 'select',
          options: ['B737-800', 'B737 MAX 8', 'A330-200', 'A330-900', 'ATR 72-600', 'B767-300', 'A320'],
          required: true,
        },
      ],
    },
    {
      id: 'experience',
      title: 'Trainee’s previous experience',
      kind: 'notes',
      minHeight: 26,
      fields: [
        {
          id: 'experience',
          label: 'Trainee’s previous experience',
          type: 'textarea',
          width: 'full',
          placeholder: 'Types exploités, heures de vol, qualifications détenues…',
        },
      ],
    },
    {
      id: 'requirements',
      title: 'Required',
      subtitle: 'Cocher OUI ou NON, puis porter la date d’effet ou de réalisation',
      kind: 'checklist',
      exclusiveTicks: true,
      tickColumns: [
        { id: 'yes', label: 'Yes', mark: 'V', color: '#52B685' },
        { id: 'no', label: 'No', mark: 'X', color: '#DB524C' },
      ],
      trailingColumns: [{ id: 'date', label: 'Date of effect or completion', type: 'date' }],
      items: [
        item('company_induction', 'Company Induction'),
        item('technical_exam', 'Technical Examination / Refresher'),
        item('flight_planning', 'Flight Planning / Performance'),
        item('crm', 'Crew Resource Management'),
        item('sep', 'SEP Initial / Triennial'),
        item('spe', 'SPE Annual'),
        item('security', 'Security / Dangerous Goods'),
        item('type_rating', 'Type Rating'),
        item('instrument_rating', 'Instrument Rating'),
        item('opc', 'Operator’s Proficiency Check'),
        item('lvp', 'Low Visibility Procedures Initial / Renewal'),
        item('initial_line_check', 'Initial Line Check'),
        item('etops_rvsm', 'ETOPS / RVSM'),
        item('tcas', 'TCAS'),
        item('base_training', 'Aircraft Base Training'),
        item('line_sectors', 'Line Training sector required'),
        item('final_line_check', 'Final Line Check'),
      ],
    },
    {
      id: 'certification',
      title: 'Certification',
      note: 'I certify that the required training has been completed to a satisfactory standard.',
      kind: 'endorsement',
      fields: [
        { id: 'signed', label: 'Signed', type: 'signature', width: 'third' },
        { id: 'appointment', label: 'Appointment', type: 'text', width: 'third' },
        { id: 'cert_date', label: 'Date', type: 'date', width: 'third' },
      ],
    },
  ],
}
