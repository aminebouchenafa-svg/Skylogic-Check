import type { FormDef } from '../types/form'

/**
 * SIMULATOR CONSOLE HANDLING CERTIFICATE — REF. D.O.A, Training Department.
 *
 * Attestation : le TRI certifie qu'un commandant de bord est habilité à tenir
 * la console du simulateur. Pas de notation, une phrase à compléter et un visa.
 */
export const simConsoleForm: FormDef = {
  id: 'sim-console',
  code: 'D.O.A — SIMULATOR CONSOLE HANDLING CERTIFICATE',
  title: 'Simulator Console',
  printTitle: 'Simulator Console Handling Certificate',
  subtitle: 'Habilitation à tenir la console du simulateur',
  category: 'Simulateur',
  revision: 'REF. D.O.A – Training Department',
  accent: '#12C2CF',
  icon: 'certificate',
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
        {
          id: 'aircraft_type',
          label: 'Aircraft type',
          type: 'select',
          width: 'half',
          options: ['B737-800', 'B737 MAX 8', 'A330-200', 'A330-900', 'ATR 72-600', 'B767-300', 'A320'],
          required: true,
        },
      ],
    },
    {
      id: 'certificate',
      title: 'Attestation',
      kind: 'statement',
      statement: {
        template:
          'I hereby certify TRI {tri} instructor on {simulator} Simulator that Captain {captain} ' +
          'is qualified to handle simulator console.',
        blanks: [
          { id: 'tri', label: 'Nom du TRI', size: 20 },
          { id: 'simulator', label: 'Simulateur', size: 14 },
          { id: 'captain', label: 'Nom du commandant', size: 20 },
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
