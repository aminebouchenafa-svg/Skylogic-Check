import type { FormDef, GradedItemDef } from '../types/form'

const topic = (id: string, label: string): GradedItemDef => ({ id, label })
const heading = (id: string, label: string): GradedItemDef => ({ id, label, heading: true })

/** Quatre visas possibles : le Training Captain porte ses initiales et la date. */
const initialsColumns = [
  { id: 'tc_1', label: 'Initials & Date', type: 'text' as const },
  { id: 'tc_2', label: 'Initials & Date', type: 'text' as const },
  { id: 'tc_3', label: 'Initials & Date', type: 'text' as const },
  { id: 'tc_4', label: 'Initials & Date', type: 'text' as const },
]

/**
 * LINE TRAINING — DISCUSSION SUBJECTS — REF. OMD ED 03.
 *
 * Relevé des sujets abordés pendant la formation en ligne. Chaque sujet est
 * visé par le Training Captain qui l'a traité, jusqu'à quatre fois.
 */
export const discussionSubjectsForm: FormDef = {
  id: 'discussion-subjects',
  code: 'OMD ED 03 — LINE TRAINING DISCUSSION SUBJECTS',
  title: 'Discussion Subjects',
  printTitle: 'Line Training — Discussion Subjects',
  subtitle: 'Sujets traités en formation en ligne',
  category: 'Ligne',
  revision: 'OMD ED 03 – REV 17 JUL 2026',
  accent: '#E0518B',
  icon: 'discussion',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      pairsPerRow: 3,
      fields: [
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'date', label: 'Date', type: 'date', required: true },
        {
          id: 'position',
          label: 'Position',
          type: 'select',
          options: ['Captain', 'F/O'],
          required: true,
        },
        { id: 'licence', label: 'Licence Type & Nbr', type: 'text' },
        { id: 'staff_id', label: 'Staff ID', type: 'text' },
        {
          id: 'aircraft_type',
          label: 'A/C Type',
          type: 'select',
          options: ['ATR 72', 'B737-NG', 'A330'],
          required: true,
        },
      ],
    },
    {
      id: 'topics',
      title: 'Discussion Topics',
      subtitle: 'Training Captain initials & date',
      kind: 'checklist',
      trailingColumns: initialsColumns,
      items: [
        heading('h_systems', '1. A/C systems — normal, abnormal'),
        topic('air_cond', 'Air cond., press. & vent. system'),
        topic('auto_flight', 'Auto flight system'),
        topic('communication', 'Communication system'),
        topic('electric', 'Electric system'),
        topic('equipment', 'Equipment'),
        topic('fire', 'Fire protection system'),
        topic('flight_controls', 'Flight controls'),
        topic('fuel', 'Fuel system'),
        topic('hydraulic', 'Hydraulic system'),
        topic('ice_rain', 'Ice and rain protection'),
        topic('indicating', 'Indicating / recording systems'),
        topic('landing_gear', 'Landing gear'),
        topic('lights', 'Lights'),
        topic('navigation', 'Navigation'),
        topic('surveillance', 'Surveillance'),
        topic('oxygen', 'Oxygen'),
        topic('pneumatic', 'Pneumatic'),
        topic('water_waste', 'Water / waste'),
        topic('maintenance', 'Maintenance system'),
        topic('information', 'Information system'),
        topic('apu', 'APU'),
        topic('doors', 'Doors'),
        topic('windows', 'Cockpit windows'),
        topic('engines', 'Engines'),
        topic('limitations', 'Limitations'),
        topic('memory_items', 'Memory items'),
        topic('evacuation', 'Evacuation procedure'),

        heading('h_performance', '2. Performance'),
        topic('weight_balance', 'Weight & balance'),
        topic('load_trim', 'Load & trim sheet'),
        topic('to_climb_cruise', 'T/O, climb & cruise performance'),
        topic('approach_landing', 'Approach & landing performance'),
        topic('obstacle', 'Obstacle clearance'),
        topic('fuel_planning', 'Fuel planning'),
        topic('diversion', 'Diversion'),
        topic('mel_cdl', 'MEL / CDL'),
        topic('driftdown', 'Engine-out driftdown'),
        topic('special_routes', 'Special routes & airports'),
        topic('cpdlc', 'CPDLC'),
        topic('efb', 'EFB'),

        heading('h_misc', '3. Miscellaneous'),
        topic('fom', 'FOM'),
        topic('aoc_ops_specs', 'AOC & OPS SPECS'),
        topic('xwind', 'X-wind T/O & landing'),
        topic('comm_failure', 'COMM. failure procedures'),
        topic('fans', 'FANS B +'),
        topic('route_manual', 'Route manual'),
        topic('emergency_prep', 'Prepared & unprepared emergency'),
        topic('crew_comm', 'Crew COMM. & coordination during threat'),
        topic('deicing', 'Adverse weather — de-/anti-icing policies & procedures'),
        topic('contaminated', 'Adverse weather — contaminated runway operations'),
        topic('thunderstorm', 'Adverse weather — thunderstorm avoidance'),
        topic('turbulence', 'Adverse weather — flight in turbulence'),
        topic('cold_weather', 'Adverse weather — cold weather operation'),
        topic('volcanic', 'Adverse weather — operation near volcanic ash'),
      ],
    },
    {
      id: 'ftm',
      title: 'Fleet Training Manager',
      kind: 'endorsement',
      fields: [
        { id: 'ftm_date', label: 'Date', type: 'date', width: 'half' },
        { id: 'ftm_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
  ],
}
