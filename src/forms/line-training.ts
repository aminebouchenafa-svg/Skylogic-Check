import type { FormDef } from '../types/form'
import { signatureSection } from './shared'
import { REMINDER_LINE } from './scales'

/**
 * LINE TRAINING — REF. D.O.A, Training Department, Air Algérie.
 * Formulaire sur deux pages : en-tête et compteurs, puis PREFLIGHT /
 * In-flight / POST FLIGHT et la note globale.
 */
export const lineTrainingForm: FormDef = {
  id: 'line-training',
  code: 'D.O.A — LINE TRAINING',
  title: 'Line Training',
  subtitle: 'Adaptation en ligne sous supervision',
  category: 'Ligne',
  revision: 'REF. D.O.A – Training Department',
  accent: '#E8792B',
  icon: 'training',
  scaleId: 'ah-5-1',
  reminder: REMINDER_LINE,
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'position', label: 'Position', type: 'select', width: 'quarter', options: ['CAPT', 'F/O'], required: true },
        { id: 'name', label: 'Name', type: 'text', width: 'half', required: true },
        { id: 'date', label: 'Date', type: 'date', width: 'quarter', required: true },
        {
          id: 'aircraft_type',
          label: 'A/C Type',
          type: 'select',
          width: 'quarter',
          options: ['B737-800', 'B737 MAX 8', 'A330-200', 'A330-900', 'ATR 72-600', 'B767-300', 'A320'],
          required: true,
        },
        { id: 'aircraft_reg', label: 'A/C REG', type: 'text', width: 'quarter' },
        { id: 'safety_pilot', label: 'Safety Pilot', type: 'select', width: 'quarter', options: ['Yes', 'No'] },
        { id: 'tri_name', label: 'TRI Name', type: 'text', width: 'quarter' },
      ],
    },
    {
      id: 'counters',
      title: 'Sectors and times',
      kind: 'matrix',
      matrix: {
        groups: [
          { label: 'Number of sectors flown', span: 2 },
          { label: 'Times (hh / mm)', span: 2 },
        ],
        columns: [
          { id: 'sect_pf', label: 'PF', type: 'number' },
          { id: 'sect_pm', label: 'PM', type: 'number' },
          { id: 'time_pf', label: 'PF', type: 'text' },
          { id: 'time_pm', label: 'PM', type: 'text' },
        ],
        rows: [
          { id: 'previous', label: 'Previous' },
          { id: 'present', label: 'Present' },
          { id: 'total', label: 'Total' },
        ],
      },
    },
    {
      id: 'flights',
      title: 'Flights',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'flt', label: 'FLT Nbr', type: 'text', prefix: 'AH' },
          { id: 'from', label: 'FROM', type: 'text' },
          { id: 'to', label: 'TO', type: 'text' },
        ],
        rows: [
          { id: 'f1', label: '1' },
          { id: 'f2', label: '2' },
          { id: 'f3', label: '3' },
          { id: 'f4', label: '4' },
          { id: 'f5', label: '5' },
          { id: 'f6', label: '6' },
        ],
      },
    },
    {
      id: 'preflight',
      title: 'PREFLIGHT',
      kind: 'grading',
      items: [
        { id: 'pre_1', code: '1', label: 'Meteo folder, NOTAM and OFP (JETPLAN)' },
        { id: 'pre_2', code: '2', label: 'Fuel and Tankering Policy' },
        { id: 'pre_3', code: '3', label: 'Aircraft documents check' },
        { id: 'pre_4', code: '4', label: 'Cockpit preparation' },
        { id: 'pre_5', code: '5', label: 'Weight & balance, load trim sheet and T/O data card preparation' },
        { id: 'pre_6', code: '6', label: 'Takeoff performance, Use of RWY Analysis / EFB USE' },
        { id: 'pre_7', code: '7', label: 'Low visibility takeoff minima / Takeoff alternate' },
        { id: 'pre_8', code: '8', label: 'A/C status review' },
        { id: 'pre_9', code: '9', label: 'Use of MEL / DDG and status message' },
        { id: 'pre_10', code: '10', label: 'Takeoff & Departure Briefing' },
        { id: 'pre_11', code: '11', label: 'Taxi routes and Taxi technique' },
        { id: 'pre_12', code: '12', label: 'Handling delays with PAX' },
      ],
    },
    {
      id: 'inflight',
      title: 'In-flight',
      kind: 'grading',
      items: [
        { id: 'inf_1', code: '1', label: 'A/C limitations' },
        { id: 'inf_2', code: '2', label: 'Use of NAVAIDS / FMC' },
        { id: 'inf_3', code: '3', label: 'En-route MORA / GRID MORA' },
        { id: 'inf_4', code: '4', label: 'R/T procedure and Public Adress' },
        { id: 'inf_5', code: '5', label: 'Use of in-flight performance, OPT FL, Max REC altitude' },
        { id: 'inf_6', code: '6', label: 'Navigation Log keeping and fuel checks at waypoints' },
        { id: 'inf_7', code: '7', label: 'Unlawful interference, aggressive passenger or bomb threat procedure' },
        { id: 'inf_8', code: '8', label: 'Firefighting and rescue services' },
        { id: 'inf_9', code: '9', label: 'De-icing / Anti-icing' },
        { id: 'inf_10', code: '10', label: 'A/C systems (electrical, hydraulic…)' },
        { id: 'inf_11', code: '11', label: 'ETOPS (if applicable)' },
        { id: 'inf_12', code: '12', label: 'RVSM (if applicable)' },
        { id: 'inf_13', code: '13', label: 'PBN operations (B-RNAV, P-RNAV…), RNP Operations' },
        { id: 'inf_14', code: '14', label: 'En-route weather and diversion aerodromes' },
        { id: 'inf_15', code: '15', label: 'English level evaluation' },
        { id: 'inf_16', code: '16', label: 'Descent planning' },
        { id: 'inf_17', code: '17', label: 'Approach briefing' },
        { id: 'inf_18', code: '18', label: 'Precision approach, Cat 2/3' },
        { id: 'inf_19', code: '19', label: 'Non-ILS procedure' },
        { id: 'inf_20', code: '20', label: 'Weather radar and terrain display policy' },
        { id: 'inf_21', code: '21', label: 'Stabilized approach' },
        { id: 'inf_22', code: '22', label: 'Flare and landing technique' },
        { id: 'inf_23', code: '23', label: 'Use of brakes and reverse thrust' },
      ],
    },
    {
      id: 'postflight',
      title: 'POST FLIGHT',
      kind: 'grading',
      items: [
        { id: 'post_1', code: '1', label: 'A/C technical log checking and signing' },
        { id: 'post_2', code: '2', label: 'Flight envelope checking' },
      ],
    },
    {
      id: 'overall',
      title: 'Overall pilot grading',
      kind: 'grading',
      items: [{ id: 'overall_grading', label: 'OVERALL PILOT GRADING', allowNA: false }],
      commentField: {
        id: 'overall_comment',
        label: 'Comments',
        placeholder: 'Progression, points forts, axes de travail, suite du programme…',
      },
    },
    signatureSection('TRI Name & Signature'),
  ],
}
