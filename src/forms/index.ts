import type { FormDef } from '../types/form'
import { lineControlForm } from './line-control'
import { lineTrainingForm } from './line-training'
import { proficiencyCheckForm } from './proficiency-check'

/**
 * Catalogue des formulaires.
 *
 * Les entrées « pending » sont réservées : elles apparaissent sur l'accueil,
 * en veille, et s'activent dès que leur modèle officiel est intégré.
 */

const placeholder = (
  id: string,
  code: string,
  title: string,
  subtitle: string,
  category: FormDef['category'],
  accent: string,
  icon: string,
): FormDef => ({
  id,
  code,
  title,
  subtitle,
  category,
  revision: 'En attente du modèle officiel',
  accent,
  icon,
  scaleId: 'ah-5-1',
  sections: [],
  pending: true,
})

export const FORMS: FormDef[] = [
  lineControlForm,
  lineTrainingForm,
  proficiencyCheckForm,
  placeholder('line-form', 'D.O.A — LINE FORM', 'Line Form', 'Suivi de vol en ligne', 'Ligne', '#7B61FF', 'report'),
  placeholder('skill-test', 'D.O.A — SKILL TEST', 'Skill Test', 'Épreuve pratique de qualification de type', 'Examen', '#E5383B', 'skill'),
  placeholder('remedial', 'D.O.A — REMEDIAL', 'Remedial Training', 'Entraînement de remédiation', 'Remédiation', '#E3B23C', 'remedial'),
]

export const CATEGORIES: FormDef['category'][] = ['Ligne', 'Simulateur', 'Examen', 'Remédiation']

export function getForm(id: string): FormDef | undefined {
  return FORMS.find((f) => f.id === id)
}
