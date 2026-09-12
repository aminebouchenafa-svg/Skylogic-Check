import type { FormDef, GradedItemDef } from '../types/form'
import { REMINDER_LINE } from './scales'
import { SCALE_COMMAND } from './scales-command'
import { AIRPORTS, FLEET } from './network'

/**
 * COMMAND UPGRADE – ASSESSMENT FLIGHT — REF. D.O.A, Training Department.
 *
 * Particularité : chaque item est noté sur plusieurs secteurs, d'où les cinq
 * colonnes de notation. Le barème détaillé figure au dos du formulaire.
 */

const items: GradedItemDef[] = [
  { id: 'h_doc', label: 'Flt. documentation', heading: true },
  {
    id: 'doc',
    label: 'CFP, WX, NOTAM, Fuel planning :',
    description: 'Completed in a thorough and neat manner.',
  },

  { id: 'h_dep', label: 'Departure', heading: true },
  {
    id: 'dep_cockpit',
    label: 'Cockpit Prep :',
    description: 'Completes all actions in correct sequence in a timely manner.',
  },
  {
    id: 'dep_briefing',
    label: 'Briefing :',
    description: 'Clear, Comprehensive and relevant, with max reference to EFIS and CDU display data.',
  },
  {
    id: 'dep_start_taxi',
    label: 'Start & Taxi :',
    description:
      'Pushback/Engine Start Procedure, After Start Procedure, Taxing Procedure & Technique are ' +
      'correctly executed.',
  },
  {
    id: 'dep_takeoff',
    label: 'Take-off :',
    description:
      'Maintains centerline, timely and correct callouts, maintains speed and follows FDs commands ' +
      'accurately, configuration changes on schedule, follows published SIDs, Noise Abetment and ATC ' +
      'instruction, respects task sharing requirements.',
  },
  {
    id: 'dep_climb',
    label: 'Climb :',
    description: 'Ability to use various climb techniques, follows SOPs.',
  },

  { id: 'h_cruise', label: 'Cruise', heading: true },
  {
    id: 'cruise',
    label:
      'Reviews ECAM MEMO / EICAS and ECAM SYS pages (Airbus), monitors flight progress, fuel status ' +
      'and navigation accuracy and monitors weather for avoidance if applicable.',
  },

  { id: 'h_arr', label: 'Arrival', heading: true },
  {
    id: 'arr_descent',
    label: 'Descent :',
    description:
      'Descent and approach preparation carried out in good time before top of descent, ability to use ' +
      'various descent techniques, aware of and maintains descent profile, aware of fuel requirement for ' +
      'diversion and monitor WX for avoidance if applicable.',
  },
  {
    id: 'arr_briefing',
    label: 'Briefing :',
    description: 'Clear, Comprehensive and relevant, with max reference to EFIS and CDU display data.',
  },
  {
    id: 'arr_approach',
    label: 'Approach :',
    description:
      'Correct and timely configuration, lateral and vertical profile within limits, speed within limits ' +
      'and approach stabilized, correct decision to land or go around at MDA/VDP, flies the visual segment ' +
      'smoothly and lands within touch-down zone.',
  },
  {
    id: 'arr_landing',
    label: 'Landing :',
    description:
      'Uses correct landing technique, correct reverse thrust and braking technique, maintains centreline.',
  },

  { id: 'h_handling', label: 'Handling ability', heading: true },
  {
    id: 'handling',
    label:
      'Safe smooth accurate and confident handling, early detection of profile deviation, timely and ' +
      'positive corrective action.',
  },

  { id: 'h_sop', label: 'SOP', heading: true },
  { id: 'sop', label: 'Knowledge of and adherence to standard operating procedures.' },

  { id: 'h_crm', label: 'CRM / TEM, NOTECH', heading: true },
  { id: 'crm_task', label: 'Ensures application of task sharing requirements and good :' },
  { id: 'crm_com', label: 'Communication' },
  { id: 'crm_leadership', label: 'Leadership and Teamwork' },
  { id: 'crm_workload', label: 'Workload Management' },

  { id: 'h_sa', label: 'Situation awareness', heading: true },
  {
    id: 'sa',
    label:
      'Maintains good position and terrain awareness with reference to enroute and approach charts, MEAs ' +
      'and MSAs, awareness and assessment of enroute, destination and alternate weather conditions, ' +
      'awareness and monitoring of system and fuel status, exercises ATC and traffic vigilance, makes good ' +
      'use of all available data ensuring good planning and stays ahead of the airplane.',
  },

  { id: 'h_rt', label: 'R/T', heading: true },
  { id: 'rt', label: 'Correct R/T procedures & phraseology and maintains good R/T discipline.' },

  { id: 'h_tech', label: 'Technical knowledge', heading: true },
  {
    id: 'tech_normal',
    label: 'Normal :',
    description:
      'Demonstrates good operational knowledge of aircraft systems, familiar with FCOM & QRH content, ' +
      'OEBs and FCOM bulletins.',
  },
  {
    id: 'tech_other',
    label: 'Other :',
    description:
      'Good knowledge and interpretation of Met. Reports and forecasts, en-route and approach charts, ' +
      'familiar with the content of JEPPESEN general text.',
  },
]

export const commandUpgradeForm: FormDef = {
  id: 'command-upgrade',
  code: 'D.O.A — COMMAND UPGRADE ASSESSMENT FLIGHT',
  title: 'Command Upgrade',
  printTitle: 'Command Upgrade – Assessment Flight',
  subtitle: 'Vol d’évaluation en vue du lâcher commandant de bord',
  category: 'Examen',
  revision: 'REF. D.O.A – Training Department',
  accent: '#E0518B',
  icon: 'command',
  scaleId: SCALE_COMMAND.id,
  reminder: REMINDER_LINE,
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      pairsPerRow: 3,
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'position', label: 'Position', type: 'select', options: ['CAPT', 'F/O'], required: true },
        { id: 'staff_id', label: 'Staff ID', type: 'text' },
        {
          id: 'aircraft_type',
          label: 'A/C Type',
          type: 'select',
          options: FLEET,
          required: true,
        },
        { id: 'date', label: 'Date', type: 'date', required: true },
      ],
    },
    {
      id: 'sectors',
      title: 'Secteurs',
      subtitle: 'Un secteur par colonne de notation',
      kind: 'matrix',
      matrix: {
        columns: [
          { id: 'duty', label: 'Duty', type: 'select', options: ['PF', 'PM'] },
          { id: 'from', label: 'From', type: 'text', suggestions: AIRPORTS, uppercase: true },
          { id: 'to', label: 'To', type: 'text', suggestions: AIRPORTS, uppercase: true },
          { id: 'approach', label: 'Types of Approach', type: 'text' },
        ],
        rows: [
          { id: 's1', label: '1' },
          { id: 's2', label: '2' },
          { id: 's3', label: '3' },
          { id: 's4', label: '4' },
          { id: 's5', label: '5' },
        ],
      },
    },
    {
      id: 'markers',
      title: 'Pilot Assessment Markers',
      subtitle: 'Notation secteur par secteur',
      kind: 'grading',
      gradeColumns: [
        { id: 'c1', label: '1' },
        { id: 'c2', label: '2' },
        { id: 'c3', label: '3' },
        { id: 'c4', label: '4' },
        { id: 'c5', label: '5' },
      ],
      items,
    },
    {
      id: 'rules',
      title: 'Note',
      kind: 'reference',
      referenceRows: [
        {
          label: '1',
          description: 'Overall Pilot Grading shall reflect the above average Pilot Assessment Markers Grades.',
        },
        {
          label: '2',
          description: 'Assessment Flight will be considered unsatisfactory if overall grade 3 and below is achieved.',
        },
        {
          label: '3',
          description:
            'A Single Pilot Assessment Marker Graded 1 or more than two Markers Graded 2 will result in the ' +
            'Command Upgrade Assessment to be considered as Fail.',
        },
      ],
    },
    {
      id: 'overall',
      title: 'Overall pilot grading',
      kind: 'grading',
      items: [{ id: 'overall_grading', label: 'OVERALL PILOT GRADING', allowNA: false }],
    },
    {
      id: 'comments',
      title: 'Comments',
      kind: 'endorsement',
      fields: [
        { id: 'comments', label: 'Comments', type: 'textarea', width: 'full' },
        { id: 'instructor_name', label: "Instructor's name", type: 'text', width: 'half' },
        { id: 'instructor_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
    {
      id: 'management',
      title: 'Management certification',
      kind: 'endorsement',
      fields: [
        { id: 'mgmt_sig', label: 'Signature', type: 'signature', width: 'third' },
        { id: 'mgmt_appointment', label: 'Appointment', type: 'text', width: 'third' },
        { id: 'mgmt_date', label: 'Date', type: 'date', width: 'third' },
      ],
    },
    {
      id: 'barème',
      title: 'Command Ability Grading',
      subtitle: 'Définition des notes, reprise du formulaire officiel',
      kind: 'reference',
      referenceRows: SCALE_COMMAND.levels.map((level) => ({
        label: level.short,
        description: `${level.label} — ${level.description ?? ''}`,
        color: level.color,
      })),
    },
  ],
}
