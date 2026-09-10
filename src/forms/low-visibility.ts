import type { FormDef } from '../types/form'

/**
 * LOW VISIBILITY OPERATIONS CERTIFICATE — REF. D.O.A, § 13.1.13.
 *
 * Certificat d'habilitation aux opérations par faible visibilité : une
 * attestation encadrée signée par le Chief Pilot / Fleet Training Manager,
 * la catégorie retenue, puis le visa de l'instructeur et la date du contrôle.
 */
export const lowVisibilityForm: FormDef = {
  id: 'low-visibility',
  code: 'D.O.A — 13.1.13 LOW VISIBILITY OPERATIONS CERTIFICATE',
  title: 'Low Visibility',
  printTitle: 'Low Visibility Operations Certificate',
  subtitle: 'Habilitation CAT II / CAT III',
  category: 'Simulateur',
  revision: 'REF. D.O.A – Training Department',
  accent: '#6FA8DC',
  icon: 'lowvis',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'certificate',
      title: 'Attestation',
      kind: 'statement',
      statement: {
        framed: true,
        template:
          'THIS IS TO CERTIFY THAT\n\n' +
          'Captain / FO {name}\n\n' +
          'is authorized to carry out Low Visibility Operations\n\n' +
          'On {aircraft} aircraft\n\n' +
          'to the category shown on the record overleaf',
        blanks: [
          { id: 'name', label: 'Nom du pilote', size: 26, required: true },
          { id: 'aircraft', label: 'Type avion', size: 16, required: true },
        ],
      },
    },
    {
      id: 'authority',
      title: 'Signed',
      subtitle: 'Visa de l’autorité qui délivre le certificat',
      note: 'Chief Pilot / Fleet Training Manager / Chief Pilot Training',
      kind: 'signature',
      fields: [
        { id: 'sig_authority', label: 'Signature', type: 'signature', width: 'half' },
        { id: 'sig_authority_name', label: 'Name', type: 'text', width: 'half' },
      ],
    },
    {
      id: 'category',
      title: 'Category',
      subtitle: 'Check the correct category (x)',
      kind: 'result',
      choices: [
        { value: 'cat2', label: 'CAT II', color: '#E9A03D' },
        { value: 'cat3a', label: 'CAT III A', color: '#4E80ED' },
        { value: 'cat3b', label: 'CAT III B', color: '#7C5CE0' },
      ],
    },
    {
      id: 'instructor',
      title: 'Instructor',
      kind: 'endorsement',
      fields: [
        { id: 'instructor_name', label: 'Instructor’s Name', type: 'text', width: 'half' },
        { id: 'instructor_sig', label: 'Signature', type: 'signature', width: 'half' },
      ],
    },
    {
      id: 'check',
      title: 'Check',
      kind: 'identification',
      fields: [
        { id: 'licence', label: 'Licence N° (ATPL)', type: 'text' },
        { id: 'check_date', label: 'Date of Check', type: 'date', required: true },
      ],
    },
  ],
}
