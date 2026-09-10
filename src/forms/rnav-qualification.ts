import type { FormDef } from '../types/form'

const OUI = '#52B685'
const NON = '#DB524C'

/**
 * RNAV APPROACHES – INITIAL QUALIFICATION TRAINING — REF. D.O.A.
 *
 * Qualification initiale aux approches RNAV : questionnaire de connaissances,
 * briefing et séance simulateur, puis les visas instructeur, stagiaire et
 * administration.
 */
export const rnavQualificationForm: FormDef = {
  id: 'rnav-qualification',
  code: 'D.O.A — RNAV APPROACHES INITIAL QUALIFICATION',
  title: 'RNAV Qualification',
  printTitle: 'RNAV Approaches – Initial Qualification Training',
  subtitle: 'Qualification initiale aux approches RNAV',
  category: 'Simulateur',
  revision: 'REF. D.O.A – Training Department',
  accent: '#5B8DEF',
  icon: 'rnav',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Trainee details',
      kind: 'identification',
      pairsPerRow: 3,
      fields: [
        { id: 'staff_id', label: 'Staff ID', type: 'text' },
        { id: 'position', label: 'Position', type: 'select', options: ['CAPT', 'F/O'], required: true },
        { id: 'name', label: 'Name', type: 'text', required: true },
        {
          id: 'aircraft_type',
          label: 'Aircraft Type',
          type: 'select',
          options: ['B737-800', 'B737 MAX 8', 'A330-200', 'A330-900', 'ATR 72-600', 'B767-300', 'A320'],
          required: true,
        },
        { id: 'date', label: 'Date', type: 'date', required: true },
      ],
    },
    {
      id: 'questionnaire',
      title: 'Knowledge questionnaire',
      subtitle: 'Enter your answers in the spaces provided below',
      kind: 'answers',
      answerCount: 10,
    },
    {
      id: 'requirements',
      title: 'RNAV approach training requirements',
      kind: 'result',
      choiceRows: [
        {
          id: 'questionnaire_result',
          label: 'Result',
          hint: 'Pass mark 75 %',
          options: [
            { value: 'Pass', label: 'Pass', color: OUI },
            { value: 'Fail', label: 'Fail', color: NON },
          ],
        },
        {
          id: 'pre_sim_briefing',
          label: 'Pre-simulator briefing',
          options: [
            { value: 'Completed', label: 'Completed', color: OUI },
            { value: 'Not Completed', label: 'Not Completed', color: NON },
          ],
        },
        {
          id: 'simulator_training',
          label: 'Simulator training',
          options: [
            { value: 'Completed', label: 'Completed', color: OUI },
            { value: 'Not Completed', label: 'Not Completed', color: NON },
          ],
        },
        {
          id: 'outcome',
          label: 'Outcome of training',
          options: [
            { value: 'Satisfactory', label: 'Satisfactory', color: OUI },
            { value: 'Additional Training Required', label: 'Additional Training Required', color: '#E87B36' },
          ],
        },
      ],
    },
    {
      id: 'score',
      title: 'Score',
      kind: 'identification',
      fields: [{ id: 'score', label: 'Score (%)', type: 'number', width: 'quarter' }],
    },
    {
      id: 'instructor',
      title: 'Instructor certification',
      kind: 'endorsement',
      fields: [
        { id: 'instructor_name', label: "Instructor's name", type: 'text', width: 'quarter' },
        { id: 'instructor_staff', label: 'Staff ID', type: 'text', width: 'quarter' },
        { id: 'instructor_licence', label: 'License Nbr', type: 'text', width: 'quarter' },
        { id: 'instructor_sig', label: 'Signature', type: 'signature', width: 'quarter' },
      ],
    },
    {
      id: 'trainee',
      title: 'Trainee certification',
      note: 'I have read the content of this report and acknowledge the overall outcome.',
      kind: 'endorsement',
      fields: [
        { id: 'trainee_name', label: "Trainee's name", type: 'text', width: 'quarter' },
        { id: 'trainee_staff', label: 'Staff ID', type: 'text', width: 'quarter' },
        { id: 'trainee_licence', label: 'License Nbr', type: 'text', width: 'quarter' },
        { id: 'trainee_sig', label: 'Signature', type: 'signature', width: 'quarter' },
      ],
    },
    {
      id: 'admin',
      title: 'Office use only — Flight Training Administration',
      kind: 'endorsement',
      fields: [
        { id: 'admin_correct', label: 'Form is correct and complete', type: 'checkbox', width: 'half' },
        { id: 'admin_filed', label: 'Form signed by FTM and ready for filing', type: 'checkbox', width: 'half' },
        { id: 'admin_date', label: 'Date', type: 'date', width: 'half' },
        { id: 'admin_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
    {
      id: 'ftm',
      title: 'Office use only — Fleet Training Manager (FTM)',
      kind: 'endorsement',
      fields: [
        { id: 'ftm_date', label: 'Date', type: 'date', width: 'half' },
        { id: 'ftm_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
  ],
}
