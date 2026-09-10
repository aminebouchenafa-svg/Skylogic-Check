import type { FieldDef, SectionDef } from '../types/form'
import { AIRCRAFT_REGISTRATIONS, FLEET } from './network'

/** Blocs communs aux formulaires du Training Department. */

export const remarksSection = (mandatory = true): SectionDef => ({
  id: 'remarks',
  title: 'Remarks',
  subtitle: mandatory ? 'Obligatoire pour tout item noté 1 ou 2' : undefined,
  kind: 'notes',
  fields: [
    {
      id: 'remarks',
      label: 'Remarks (Mandatory for Unsatisfactory Items)',
      type: 'textarea',
      width: 'full',
      placeholder: 'Faits observés, écarts constatés, suites à donner…',
    },
  ],
})

export const resultSection = (title: string): SectionDef => ({
  id: 'result',
  title,
  kind: 'result',
  choices: [
    { value: 'Satisfactory', label: 'Satisfactory', color: '#52B685' },
    { value: 'Unsatisfactory', label: 'Unsatisfactory', color: '#DB524C' },
  ],
  fields: [{ id: 'result', label: title, type: 'text', required: true }],
})

export const signatureSection = (examinerLabel: string): SectionDef => ({
  id: 'signatures',
  title: 'Signatures',
  subtitle: 'Signature électronique — le débriefing a été conduit et compris par les deux parties',
  kind: 'signature',
  fields: [
    { id: 'sig_crew', label: 'Flight Crew Signature', type: 'signature', width: 'half' },
    { id: 'sig_examiner', label: examinerLabel, type: 'signature', width: 'half' },
    { id: 'sig_examiner_name', label: 'Name', type: 'text', width: 'half' },
  ],
})

export const POSITION_OPTIONS = ['CAPT', 'F/O', 'F/E']

export const aircraftField: FieldDef = {
  id: 'aircraft_type',
  label: 'Aircraft Type',
  type: 'select',
  width: 'quarter',
  options: FLEET,
  required: true,
}

/** Immatriculation : choisie dans la flotte, ou saisie si l'appareil manque. */
export const aircraftRegField: FieldDef = {
  id: 'aircraft_reg',
  label: 'A/C REG',
  type: 'text',
  width: 'quarter',
  suggestions: AIRCRAFT_REGISTRATIONS,
  uppercase: true,
}
