import type { FormDef } from '../types/form'

/**
 * MANDATORY CHECK FAILURE NOTIFICATION FORM — REF. D.O.A, Training Department.
 *
 * Ce formulaire ne se note pas : chaque item est simplement coché dans la
 * colonne CM 1 ou CM 2 lorsqu'il appelle un commentaire du standards Captain.
 * La page 2 porte les commentaires et les trois visas.
 */
export const checkFailureForm: FormDef = {
  id: 'check-failure',
  code: 'D.O.A — MANDATORY CHECK FAILURE NOTIFICATION',
  title: 'Check Failure Notification',
  printTitle: 'Mandatory Check Failure Notification Form',
  subtitle: 'Mandatory Check Failure Notification Form',
  category: 'Remédiation',
  revision: 'REF. D.O.A – Training Department',
  accent: '#E2544C',
  icon: 'notification',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      pairsPerRow: 3,
      fields: [
        { id: 'name', label: 'Name', type: 'text', width: 'half', required: true },
        { id: 'aircraft_type', label: 'Type of aircraft', type: 'text', width: 'quarter', required: true },
        { id: 'date', label: 'Date', type: 'date', width: 'quarter', required: true },
      ],
    },
    {
      id: 'sectors',
      title: 'Sectors',
      kind: 'matrix',
      matrix: {
        hideRowLabels: true,
        groups: [
          { label: 'PF (CM-1 / CM-2)', span: 1 },
          { label: 'Sector', span: 2 },
          { label: 'Types of approach and modes', span: 1 },
          { label: 'Sector asses', span: 2 },
        ],
        columns: [
          { id: 'pf', label: '', type: 'select', options: ['CM-1', 'CM-2'] },
          { id: 'from', label: 'From', type: 'text' },
          { id: 'to', label: 'To', type: 'text' },
          { id: 'approach', label: '', type: 'text' },
          { id: 'cm1', label: 'CM 1', type: 'text' },
          { id: 'cm2', label: 'CM 2', type: 'text' },
        ],
        rows: [
          { id: 's1', label: '1' },
          { id: 's2', label: '2' },
        ],
      },
    },
    {
      id: 'items',
      title: 'Items',
      subtitle: 'Cocher CM 1 ou CM 2 pour tout item appelant un commentaire',
      kind: 'checklist',
      tickColumns: [
        { id: 'cm1', label: 'CM 1' },
        { id: 'cm2', label: 'CM 2' },
      ],
      note:
        'NOTE : Do not grade the above item/items, only tick in the CM1/CM2 box any item that needs to be ' +
        'commented upon by the standards Captain at the end of the flight.',
      items: [
        { id: 'h_preflight', label: 'Pre-flight', heading: true },
        {
          id: 'preflight',
          label: 'Flight documentation reviewed thoroughly by both pilots. Logical approach to fuel uplift.',
        },

        { id: 'h_predep', label: 'Pre-departure', heading: true },
        { id: 'cockpit_prep', label: 'Cockpit Prep :', description: 'Timely Systematic. Task sharing as per SOP.' },
        {
          id: 'dep_briefing',
          label: 'Briefing :',
          description:
            'Effective. Interactive. Concise. Operationally thorough, utilizing all available resources in ' +
            'establishing a clear action plan for normal and abnormal operations.',
        },
        {
          id: 'perf_planning',
          label: 'Performance planning :',
          description:
            'Load-sheet perusal. Airfield information update. Use of LPC. Data entry accuracy, assessment of ' +
            'parameters affecting aircraft performance.',
        },
        {
          id: 'pushback',
          label: 'Push-back/start/taxi :',
          description:
            'Vigilance. Situational awareness. Task prioritization. Adherence to airfield procedures, taxi ' +
            'routes, etc. Attention to safety, airport environment and other traffic.',
        },

        { id: 'h_departure', label: 'Departure', heading: true },
        {
          id: 'takeoff_climb',
          label: 'Takeoff/Climb :',
          description:
            'Traffic awareness, Adherence to SIDs, speed/altitude constraints. Sterile cockpit concept. Task ' +
            'sharing. Call outs and checklists. Work load management.',
        },
        {
          id: 'flight_profile',
          label: 'Flight Profile :',
          description: 'Use of automation. Aircraft handling and flight management.',
        },

        { id: 'h_cruise', label: 'Cruise', heading: true },
        {
          id: 'cruise_awareness',
          label: 'Awareness :',
          description:
            'Navigation accuracy. Fuel status. R/T. Weather and Systems monitoring. Passenger and crew ' +
            'comfort. Terrain awareness. Crew alertness. Fuel economy.',
        },
        {
          id: 'cruise_workload',
          label: 'Workload management :',
          description: 'Task sharing. Call outs. Fatigue and rest management. Use of automation.',
        },

        { id: 'h_arrival', label: 'Arrival', heading: true },
        {
          id: 'descent_planning',
          label: 'Descent Planning :',
          description: 'Weather information. Cockpit preparation and briefing conducted in good time.',
        },
        {
          id: 'arr_briefing',
          label: 'Briefing :',
          description:
            'Timely. Interactive. Effective. Operationally thorough, utilizing all available resources in ' +
            'establishing a clear action plan. Possible change of runway and/or Instrument approach ' +
            'considered. Fuel status and Go-around/Diversion considered.',
        },
        {
          id: 'descent_exec',
          label: 'Descent execution :',
          description:
            'Vertical profile management. Speed and altitude control/constraints. Traffic awareness. Task ' +
            'sharing. Call outs and checklists. Sterile cockpit concept. Work load management.',
        },
        {
          id: 'approach_landing',
          label: 'Approach & Landing :',
          description:
            'Lateral and horizontal profile management. Speed and configuration management. Task sharing ' +
            'workload management. Call outs and checklists. Stabilization criteria and decision making. ' +
            'Aircraft handling.',
        },

        { id: 'h_sop', label: 'SOP', heading: true },
        { id: 'sop', label: 'Knowledge of and adherence to SOP.' },

        { id: 'h_crm', label: 'CRM / TEM', heading: true },
        {
          id: 'crm',
          label:
            'Interpersonal skills. Cockpit environment. Communication between crew and ground staff. ' +
            'Leadership. Crew coordination. Customer focus. Passenger PA (If applicable).',
        },

        { id: 'h_rt', label: 'R/T', heading: true },
        { id: 'rt', label: 'R/T procedures & phraseology. R/T Discipline. R/T Monitoring.' },

        { id: 'h_knowledge', label: 'Knowledge', heading: true },
        {
          id: 'kno_technical',
          label: 'Technical :',
          description: 'Systems knowledge. Familiarity with CAN, MEL, FCOM, QRH, OEBs and FCOM bulletins.',
        },
        {
          id: 'kno_general',
          label: 'General :',
          description:
            'Knowledge and interpretation of Met, Reports and forecasts, enroute and approach charts. Route ' +
            'and Navigation procedures (RVSM, RNP. etc). Knowledge of terrain (MEA, MORA, MSA. etc). ' +
            'Knowledge of operational procedures (OM Part A, OM Part C, JEPPESEN text. etc).',
        },

        { id: 'h_documentation', label: 'Flt. documentation', heading: true },
        { id: 'documentation', label: 'Completed in thorough and neat manner.' },
      ],
    },
    {
      id: 'comments',
      title: 'Comments',
      subtitle: 'Commentaires sur tous les items cochés, avec recommandations éventuelles',
      kind: 'endorsement',
      fields: [
        { id: 'comments', label: 'Comments', type: 'textarea', width: 'full' },
        { id: 'instructor_name', label: 'Instructor', type: 'text', width: 'half' },
        { id: 'instructor_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
    {
      id: 'ftd',
      title: 'For Flight Training Department use',
      kind: 'endorsement',
      fields: [
        { id: 'ftd_comment', label: 'Observations', type: 'textarea', width: 'full' },
        { id: 'ftd_name', label: 'Name', type: 'text', width: 'third' },
        { id: 'ftd_appointment', label: 'Appointment', type: 'text', width: 'third' },
        { id: 'ftd_sig', label: 'Signature', type: 'signature', width: 'third' },
      ],
    },
    {
      id: 'chief',
      title: 'For Chief Pilot Training use',
      kind: 'endorsement',
      fields: [
        { id: 'chief_comment', label: 'Observations', type: 'textarea', width: 'full' },
        { id: 'chief_name', label: 'Name', type: 'text', width: 'third' },
        { id: 'chief_appointment', label: 'Appointment', type: 'text', width: 'third' },
        { id: 'chief_sig', label: 'Signature', type: 'signature', width: 'third' },
      ],
    },
  ],
}
