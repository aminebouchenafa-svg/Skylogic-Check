import type { FieldDef, SectionDef } from '../types/form'

/**
 * Blocs partagés par tous les formulaires : identification équipage / vol,
 * synthèse et signatures. Ils garantissent une présentation homogène et un
 * PDF identique d'un formulaire à l'autre.
 */

const lineFields: FieldDef[] = [
  { id: 'route_from', label: 'Départ', type: 'text', width: 'quarter', placeholder: 'DAAG' },
  { id: 'route_to', label: 'Arrivée', type: 'text', width: 'quarter', placeholder: 'LFPG' },
  { id: 'block_time', label: 'Temps de vol', type: 'text', width: 'quarter', placeholder: '02:15' },
  { id: 'sectors', label: 'Nombre d’étapes', type: 'number', width: 'quarter' },
]

const simFields: FieldDef[] = [
  {
    id: 'device',
    label: 'Dispositif',
    type: 'select',
    width: 'quarter',
    options: ['FFS Niveau D', 'FTD', 'FNPT II', 'Avion'],
  },
  { id: 'device_location', label: 'Centre', type: 'text', width: 'quarter', placeholder: 'Alger' },
  { id: 'session_time', label: 'Durée séance', type: 'text', width: 'quarter', placeholder: '04:00' },
  {
    id: 'seat_occupied',
    label: 'Place occupée',
    type: 'select',
    width: 'quarter',
    options: ['Gauche', 'Droite', 'Observateur'],
  },
]

export function identificationSection(mode: 'ligne' | 'simulateur'): SectionDef {
  return {
    id: 'identification',
    title: 'Identification',
    subtitle: mode === 'ligne' ? 'Équipage et étape évaluée' : 'Équipage et séance simulateur',
    kind: 'identification',
    fields: [
      { id: 'trainee_name', label: 'Nom du candidat', type: 'text', width: 'half', required: true },
      { id: 'trainee_licence', label: 'N° de licence', type: 'text', width: 'quarter' },
      { id: 'trainee_staff', label: 'Matricule', type: 'text', width: 'quarter' },
      {
        id: 'trainee_seat',
        label: 'Fonction',
        type: 'select',
        width: 'quarter',
        options: ['CDB / PIC', 'OPL / FO', 'CDB en formation', 'Instructeur en formation'],
        required: true,
      },
      {
        id: 'aircraft_type',
        label: 'Type avion',
        type: 'select',
        width: 'quarter',
        options: ['B737-800', 'B737 MAX 8', 'A330-200', 'ATR 72-600', 'B767-300', 'A320'],
        required: true,
      },
      { id: 'date', label: 'Date', type: 'date', width: 'quarter', required: true },
      {
        id: 'session_ref',
        label: mode === 'ligne' ? 'N° de vol' : 'Séance n°',
        type: 'text',
        width: 'quarter',
        placeholder: mode === 'ligne' ? 'AH1006' : 'FFS 04',
      },
      ...(mode === 'ligne' ? lineFields : simFields),
      { id: 'instructor_name', label: 'Instructeur / Examinateur', type: 'text', width: 'half', required: true },
      { id: 'instructor_id', label: 'N° instructeur / examinateur', type: 'text', width: 'quarter' },
      {
        id: 'instructor_qual',
        label: 'Qualification',
        type: 'select',
        width: 'quarter',
        options: ['TRI', 'TRE', 'SFI', 'SFE', 'LTC', 'CRI', 'IRE'],
      },
    ],
  }
}

export function outcomeSection(options: string[]): SectionDef {
  return {
    id: 'outcome',
    title: 'Synthèse et décision',
    kind: 'notes',
    fields: [
      { id: 'outcome_result', label: 'Résultat global', type: 'select', width: 'half', options, required: true },
      { id: 'outcome_valid_until', label: 'Validité jusqu’au', type: 'date', width: 'quarter' },
      { id: 'outcome_next_check', label: 'Prochain contrôle', type: 'date', width: 'quarter' },
      {
        id: 'outcome_strengths',
        label: 'Points forts',
        type: 'textarea',
        width: 'full',
        placeholder: 'Ce qui a été bien démontré durant la séance…',
      },
      {
        id: 'outcome_improve',
        label: 'Axes d’amélioration',
        type: 'textarea',
        width: 'full',
        placeholder: 'Écarts constatés et corrections attendues…',
      },
      {
        id: 'outcome_actions',
        label: 'Actions décidées / entraînement complémentaire',
        type: 'textarea',
        width: 'full',
        placeholder: 'Séance de remédiation, briefing complémentaire, restriction…',
      },
    ],
  }
}

export const signatureSection: SectionDef = {
  id: 'signatures',
  title: 'Signatures',
  subtitle: 'Le débriefing a été conduit et compris par les deux parties',
  kind: 'signature',
  fields: [
    { id: 'sig_instructor', label: 'Instructeur / Examinateur', type: 'signature', width: 'half' },
    { id: 'sig_trainee', label: 'Candidat', type: 'signature', width: 'half' },
    { id: 'debrief_ack', label: 'Débriefing effectué et accepté par le candidat', type: 'checkbox', width: 'full' },
  ],
}
