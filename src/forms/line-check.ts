import type { FormDef } from '../types/form'
import { identificationSection, outcomeSection, signatureSection } from './common'

/**
 * MODÈLE DE RÉFÉRENCE — à remplacer par le formulaire officiel Air Algérie.
 *
 * Construit sur le référentiel de compétences OACI / AESA (9 compétences),
 * il sert de démonstration complète de la chaîne : saisie → code couleur →
 * PDF → partage. Chaque formulaire officiel transmis viendra s'ajouter ou
 * remplacer celui-ci sans toucher au moteur.
 */
export const lineCheckForm: FormDef = {
  id: 'line-check',
  code: 'FTM-LC-01',
  title: 'Line Check',
  subtitle: 'Contrôle en ligne — référentiel de compétences',
  category: 'Ligne',
  revision: 'Rev. 0 — modèle de référence',
  accent: '#22C1D6',
  scaleId: 'scale-1-5',
  sections: [
    identificationSection('ligne'),
    {
      id: 'competencies',
      title: 'Compétences observées',
      subtitle: 'Notation de 1 à 5 — le standard compagnie est atteint à partir de 3',
      kind: 'grading',
      commentField: {
        id: 'competencies_comment',
        label: 'Observations sur les compétences',
        placeholder: 'Comportements observés, situation, contexte…',
      },
      items: [
        {
          id: 'pro',
          code: 'PRO',
          label: 'Application des procédures et respect de la réglementation',
          description: 'Identifie et applique les procédures, respecte les limitations et la réglementation applicable.',
        },
        {
          id: 'com',
          code: 'COM',
          label: 'Communication',
          description: 'Communique de façon claire, concise et opportune, s’assure de la compréhension, écoute activement.',
        },
        {
          id: 'fpa',
          code: 'FPA',
          label: 'Gestion de la trajectoire — automatismes',
          description: 'Contrôle la trajectoire par les automatismes, gère les modes et les changements de configuration.',
        },
        {
          id: 'fpm',
          code: 'FPM',
          label: 'Gestion de la trajectoire — pilotage manuel',
          description: 'Contrôle la trajectoire manuellement avec précision et douceur, dans l’enveloppe de vol.',
        },
        {
          id: 'ltw',
          code: 'LTW',
          label: 'Leadership et travail en équipe',
          description: 'Crée une atmosphère de coopération, délègue, soutient l’équipage, gère les conflits.',
        },
        {
          id: 'psd',
          code: 'PSD',
          label: 'Résolution de problèmes et prise de décision',
          description: 'Identifie le problème, évalue les options et les risques, décide dans le temps imparti, réévalue.',
        },
        {
          id: 'saw',
          code: 'SAW',
          label: 'Conscience de la situation et gestion de l’information',
          description: 'Perçoit l’état de l’avion, de l’environnement et de l’équipage, anticipe l’évolution.',
        },
        {
          id: 'wlm',
          code: 'WLM',
          label: 'Gestion de la charge de travail',
          description: 'Priorise, planifie, se ménage des marges, maintient une charge de travail soutenable.',
        },
        {
          id: 'kno',
          code: 'KNO',
          label: 'Connaissances',
          description: 'Démontre la connaissance de l’avion, des systèmes, des procédures et de l’environnement opérationnel.',
        },
      ],
    },
    {
      id: 'phases',
      title: 'Phases de vol',
      subtitle: 'Conduite du vol par phase',
      kind: 'grading',
      commentField: {
        id: 'phases_comment',
        label: 'Observations par phase de vol',
        placeholder: 'Événements marquants, conditions météo, trafic…',
      },
      items: [
        { id: 'preflight', code: '1', label: 'Préparation du vol et briefing' },
        { id: 'startup', code: '2', label: 'Mise en route, roulage et départ' },
        { id: 'climb', code: '3', label: 'Montée et croisière' },
        { id: 'descent', code: '4', label: 'Descente et approche' },
        { id: 'landing', code: '5', label: 'Atterrissage et roulage arrivée' },
        { id: 'abnormal', code: '6', label: 'Situations anormales et d’urgence', allowNA: true },
        { id: 'postflight', code: '7', label: 'Opérations après vol et documentation' },
      ],
    },
    outcomeSection([
      'Satisfaisant — qualification maintenue',
      'Satisfaisant avec réserve — suivi requis',
      'Non satisfaisant — remédiation requise',
      'Séance interrompue',
    ]),
    signatureSection,
  ],
}
