import type { FormDef } from '../types/form'
import { aircraftField, POSITION_OPTIONS, remarksSection, resultSection, signatureSection } from './shared'

/**
 * PROFICIENCY CHECK — REF. D.O.A, Training Department, Air Algérie.
 * Reprise fidèle du formulaire papier : mêmes rubriques, mêmes items, même ordre.
 */
export const proficiencyCheckForm: FormDef = {
  id: 'proficiency-check',
  code: 'D.O.A — PROFICIENCY CHECK',
  title: 'Proficiency Check',
  subtitle: 'Contrôle de compétence au simulateur',
  category: 'Simulateur',
  revision: 'REF. D.O.A – Training Department',
  accent: '#F58A20',
  icon: 'simulator',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'date', label: 'Date', type: 'date', width: 'quarter', required: true },
        { id: 'position', label: 'Position', type: 'select', width: 'quarter', options: POSITION_OPTIONS, required: true },
        { id: 'name', label: 'Name', type: 'text', width: 'half', required: true },
        { id: 'staff_id', label: 'Staff ID', type: 'text', width: 'quarter' },
        { id: 'licence', label: 'License type and number', type: 'text', width: 'half' },
        aircraftField,
      ],
    },
    {
      id: 'mandatory_pf',
      title: 'Mandatory Items as PF',
      kind: 'grading',
      spread: 'main',
      column: 'left',
      items: [
        { id: 'pf_rto', label: 'Rejected takeoff' },
        { id: 'pf_efv1v2', label: 'Engine failure between V1 and V2' },
        { id: 'pf_se_ils', label: 'Single engine ILS' },
        { id: 'pf_se_ga', label: 'Single engine Go-around' },
        { id: 'pf_se_ldg', label: 'Single engine landing' },
        { id: 'pf_non_ils', label: 'Non-ILS to the minima' },
      ],
    },
    {
      id: 'mandatory_lvo',
      title: 'Mandatory low visibility items (If applicable)',
      kind: 'grading',
      spread: 'main',
      column: 'left',
      items: [
        { id: 'lvo_rto_min', label: 'Rejected take off during min take off weather' },
        { id: 'lvo_auto_1', label: 'Automatic approach N° 1' },
        { id: 'lvo_auto_2', label: 'Automatic approach N° 2' },
        { id: 'lvo_auto_3', label: 'Automatic approach N° 3' },
        { id: 'lvo_date_ac', label: 'Or date of approach on A/C', input: 'date' },
        { id: 'lvo_ga', label: 'Go-around' },
        { id: 'lvo_ldg', label: 'Landing' },
      ],
    },
    {
      id: 'loft',
      title: 'Loft Scenario',
      kind: 'grading',
      spread: 'main',
      column: 'right',
      items: [
        { id: 'loft_crew_coord', label: 'Crew coordination' },
        { id: 'loft_company_proc', label: 'Compliance with company procedures' },
        { id: 'loft_callouts', label: 'Standard call-outs' },
        { id: 'loft_checklists', label: 'Use of checklists' },
        { id: 'loft_automation', label: 'Use of automation' },
        { id: 'loft_systems', label: 'Knowledge of A/C systems' },
        { id: 'loft_exec_proc', label: 'Execution of procedures' },
        { id: 'loft_pax', label: 'Attention and communication to PAX' },
        { id: 'loft_ccm', label: 'Attention and communication with (s) CCM' },
        { id: 'loft_evac', label: 'Cabin Emergency Evacuation' },
        { id: 'loft_atc', label: 'Air traffic control communication' },
      ],
    },
    {
      id: 'rhs',
      title: 'Right Hand Seat Qualification',
      kind: 'grading',
      spread: 'main',
      column: 'right',
      items: [
        { id: 'rhs_efv1v2', label: 'Engine failure between V1 and V2' },
        { id: 'rhs_se_ils', label: 'Single engine ILS' },
        { id: 'rhs_se_ga', label: 'Single engine Go-around' },
        { id: 'rhs_se_ldg', label: 'Single engine landing' },
        { id: 'rhs_emer_descent', label: 'Emergency Descent', emphasis: true },
        { id: 'rhs_tcas', label: 'TCAS Events', emphasis: true },
      ],
    },
    remarksSection(),
    resultSection('Result of proficiency check'),
    signatureSection('Name and Signature TRI / SFI'),
  ],
}
