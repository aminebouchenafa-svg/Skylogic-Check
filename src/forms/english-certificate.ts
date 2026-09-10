import type { FormDef } from '../types/form'
import { aircraftField } from './shared'

/**
 * INSTRUCTOR ENGLISH LEVEL EVALUATION CERTIFICATE — REF. D.O.A, § 13.1.20.
 *
 * Attestation : le TRI certifie qu'un commandant a le niveau et la capacité
 * d'évaluer le niveau d'anglais.
 */
export const englishCertificateForm: FormDef = {
  id: 'english-certificate',
  code: 'D.O.A — 13.1.20 INSTRUCTOR ENGLISH LEVEL EVALUATION CERTIFICATE',
  title: 'English Level',
  printTitle: 'Instructor English Level Evaluation Certificate',
  subtitle: 'Habilitation à évaluer le niveau d’anglais',
  category: 'Simulateur',
  revision: 'REF. D.O.A – Training Department',
  accent: '#46C17A',
  icon: 'english',
  scaleId: 'ah-5-1',
  sections: [
    {
      id: 'identification',
      title: 'Identification',
      kind: 'identification',
      fields: [
        { id: 'date', label: 'Date', type: 'date', width: 'full', required: true },
        { id: 'name', label: 'Name', type: 'text', width: 'full', required: true },
        { id: 'licence', label: 'Licence type number', type: 'text', width: 'half' },
        aircraftField,
      ],
    },
    {
      id: 'certificate',
      title: 'Attestation',
      kind: 'statement',
      statement: {
        framed: true,
        template:
          'I hereby certify TRI {tri} instructor on {simulator} Simulator\n' +
          'that Captain {captain} has a required level and ability to evaluate English level.',
        blanks: [
          { id: 'tri', label: 'Nom du TRI', size: 22, required: true },
          { id: 'simulator', label: 'Simulateur', size: 14, required: true },
          { id: 'captain', label: 'Nom du commandant', size: 22, required: true },
        ],
      },
    },
    {
      id: 'signatures',
      title: 'Signature',
      subtitle: 'Signature électronique du TRI',
      kind: 'signature',
      fields: [
        { id: 'sig_examiner', label: 'Signature', type: 'signature', width: 'half' },
        { id: 'sig_examiner_name', label: 'Name', type: 'text', width: 'half' },
      ],
    },
  ],
}
