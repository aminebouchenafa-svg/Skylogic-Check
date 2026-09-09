import type { FormDef } from '../types/form'
import { lineCheckForm } from './line-check'

/**
 * Catalogue des formulaires.
 *
 * Les entrées « pending » sont les formulaires annoncés dont le modèle officiel
 * n'a pas encore été intégré : elles apparaissent dans l'application, grisées,
 * et deviennent actives dès que leur définition est ajoutée ici.
 */

const placeholder = (
  id: string,
  code: string,
  title: string,
  subtitle: string,
  category: FormDef['category'],
  accent: string,
): FormDef => ({
  id,
  code,
  title,
  subtitle,
  category,
  revision: 'En attente du modèle officiel',
  accent,
  scaleId: 'scale-1-5',
  sections: [],
  pending: true,
})

export const FORMS: FormDef[] = [
  lineCheckForm,
  placeholder('line-form', 'FTM-LF-01', 'Line Form', 'Suivi de vol en ligne', 'Ligne', '#7B61FF'),
  placeholder('line-training', 'FTM-LT-01', 'Line Training', 'Adaptation en ligne sous supervision', 'Ligne', '#2FBF71'),
  placeholder('opc', 'FTM-OPC-01', 'Proficiency Check (OPC / LPC)', 'Contrôle hors ligne au simulateur', 'Simulateur', '#F58A20'),
  placeholder('skill-test', 'FTM-ST-01', 'Skill Test', 'Épreuve pratique de qualification de type', 'Examen', '#E5383B'),
  placeholder('remedial', 'FTM-RT-01', 'Remedial Training', 'Entraînement de remédiation et suivi', 'Remédiation', '#E3B23C'),
]

export const CATEGORIES: FormDef['category'][] = ['Ligne', 'Simulateur', 'Examen', 'Remédiation']

export function getForm(id: string): FormDef | undefined {
  return FORMS.find((f) => f.id === id)
}
