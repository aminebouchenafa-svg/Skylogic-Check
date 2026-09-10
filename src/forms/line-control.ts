import type { FormDef } from '../types/form'
import { AIRCRAFT_REGISTRATIONS, AIRPORTS } from './network'
import { remarksSection, resultSection, signatureSection } from './shared'
import { REMINDER_LINE } from './scales'

/**
 * LINE CONTROL — REF. D.O.A, Training Department, Air Algérie.
 * Contrôle en ligne : au moins une étape en PF et une étape en PM.
 */
export const lineControlForm: FormDef = {
  id: 'line-control',
  code: 'D.O.A — LINE CONTROL',
  title: 'Line Control',
  subtitle: 'Contrôle en ligne',
  category: 'Ligne',
  revision: 'REF. D.O.A – Training Department',
  accent: '#0E9BF0',
  icon: 'line-check',
  scaleId: 'ah-5-1',
  reminder: REMINDER_LINE,
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'date', label: 'Date', type: 'date', width: 'quarter', required: true },
        { id: 'position', label: 'Position', type: 'select', width: 'quarter', options: ['CAPT', 'F/O'], required: true },
        { id: 'name', label: 'Name', type: 'text', width: 'half', required: true },
        { id: 'staff_id', label: 'Staff ID', type: 'text', width: 'quarter', keyboard: 'numeric' },
        {
          id: 'licence',
          label: 'License Type & Nbr',
          type: 'text',
          width: 'half',
          prefixOptions: ['PP', 'PL'],
          keyboard: 'numeric',
        },
        {
          id: 'aircraft',
          label: 'Aircraft Type & REG',
          type: 'text',
          width: 'quarter',
          required: true,
          suggestions: AIRCRAFT_REGISTRATIONS,
        },
      ],
    },
    {
      id: 'legs',
      title: 'Legs',
      kind: 'matrix',
      matrix: {
        note: 'At least one (01) leg as PF and one (01) leg as PM.',
        columns: [
          { id: 'from', label: 'From', type: 'text', suggestions: AIRPORTS },
          { id: 'to', label: 'To', type: 'text', suggestions: AIRPORTS },
          { id: 'flt', label: 'Flt N°', type: 'text', prefix: 'AH', keyboard: 'numeric' },
          { id: 'position', label: 'Position', type: 'select', options: ['PF', 'PM'] },
        ],
        rows: [
          { id: 'leg1', label: 'Leg 1' },
          { id: 'leg2', label: 'Leg 2' },
        ],
      },
    },
    {
      id: 's1',
      title: '1. Flight preparation',
      kind: 'grading',
      spread: 'main',
      column: 'left',
      items: [
        { id: 'p_weather', label: 'Weather analysis' },
        { id: 'p_fpl', label: 'Flight plan, fuel analysis and NOTAM' },
        { id: 'p_exterior', label: 'Aircraft exterior inspection' },
        { id: 'p_techlog', label: 'Technical log and load sheet verification' },
        { id: 'p_cockpit', label: 'Cockpit preparation' },
        { id: 'p_todata', label: 'Takeoff data and takeoff briefing' },
        { id: 'p_pushback', label: 'Push-back and starting procedures' },
      ],
    },
    {
      id: 's2',
      title: '2. Takeoff',
      kind: 'grading',
      spread: 'main',
      column: 'left',
      items: [
        { id: 't_v1', label: 'V1 / Vr / V2 Compliance' },
        { id: 't_rotation', label: 'Rotation technique' },
        { id: 't_thrust', label: 'Thrust setting' },
        { id: 't_limitations', label: 'Compliance with A/C limitations' },
      ],
    },
    {
      id: 's3',
      title: '3. Climb',
      kind: 'grading',
      spread: 'main',
      column: 'left',
      items: [
        { id: 'c_sid', label: 'SID and noise abatement compliance' },
        { id: 'c_flaps', label: 'Flaps retraction schedule' },
        { id: 'c_speed', label: 'Speed and altitude awareness' },
        { id: 'c_procedure', label: 'Climb procedure' },
      ],
    },
    {
      id: 's4',
      title: '4. Cruise',
      kind: 'grading',
      spread: 'main',
      column: 'left',
      items: [
        { id: 'cr_enroute', label: 'En-route procedures' },
        { id: 'cr_fuel', label: 'Fuel and weather checks' },
        { id: 'cr_nav', label: 'IRS / INS / GPS navigation procedure' },
        { id: 'cr_obstacle', label: 'En-route obstacle clearance' },
      ],
    },
    {
      id: 's5',
      title: '5. Approach',
      kind: 'grading',
      spread: 'main',
      column: 'right',
      items: [
        { id: 'a_briefing', label: 'Approach briefing' },
        { id: 'a_procedure', label: 'Approach procedure' },
        { id: 'a_parameters', label: 'Flight parameters' },
        { id: 'a_stabilized', label: 'Stabilized approach' },
      ],
    },
    {
      id: 's6',
      title: '6. Landing',
      kind: 'grading',
      spread: 'main',
      column: 'right',
      items: [
        { id: 'l_config', label: 'Aircraft configuration' },
        { id: 'l_flare', label: 'Flare, landing and deceleration after T/D' },
      ],
    },
    {
      id: 's7',
      title: '7. After landing / Shutdown',
      kind: 'grading',
      spread: 'main',
      column: 'right',
      items: [
        { id: 'al_procedure', label: 'After landing and shutdown procedure' },
        { id: 'al_nav', label: 'IRS / INS / GPS check' },
      ],
    },
    {
      id: 's8',
      title: '8. General',
      kind: 'grading',
      spread: 'main',
      column: 'right',
      items: [
        { id: 'g_crm', label: 'CRM/TEM procedures' },
        { id: 'g_checklists', label: 'Use of checklists' },
        { id: 'g_atc', label: 'ATC liaison, R/T procedures' },
        { id: 'g_english', label: 'English level evaluation' },
        { id: 'g_coord', label: 'Crew coordination' },
        { id: 'g_callouts', label: 'Call-outs' },
        { id: 'g_company', label: 'Compliance with company procedures' },
        { id: 'g_system', label: 'System operation' },
        { id: 'g_technical', label: 'Technical knowledge' },
        { id: 'g_pax', label: 'PAX relation and consideration' },
        { id: 'g_appearance', label: 'Crew appearance' },
      ],
    },
    remarksSection(),
    resultSection('Result of Line Control'),
    signatureSection('Name and Signature TRI / TRE'),
  ],
}
