import type { FormDef } from '../types/form'
import { catCAirfieldForm } from './cat-c-airfield'
import { checkFailureForm } from './check-failure'
import { commandUpgradeForm } from './command-upgrade'
import { confidentialAssessmentForm } from './confidential-assessment'
import { confidentialReportForm } from './confidential-report'
import { discussionSubjectsForm } from './discussion-subjects'
import { englishCertificateForm } from './english-certificate'
import { etopsRecordForm } from './etops-record'
import { instructorFlightForm } from './instructor-flight'
import { instructorSimulatorForm } from './instructor-simulator'
import { lineControlForm } from './line-control'
import { longAbsenceForm } from './long-absence'
import { lineReleaseForm } from './line-release'
import { lowVisibilityForm } from './low-visibility'
import { lineTrainingForm } from './line-training'
import { proficiencyCheckForm } from './proficiency-check'
import { rnavQualificationForm } from './rnav-qualification'
import { simConsoleForm } from './sim-console'
import { trainingRequirementForm } from './training-requirement'
import { uprtQualificationForm } from './uprt-qualification'

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
  checkFailureForm,
  simConsoleForm,
  lowVisibilityForm,
  commandUpgradeForm,
  rnavQualificationForm,
  confidentialReportForm,
  confidentialAssessmentForm,
  catCAirfieldForm,
  trainingRequirementForm,
  etopsRecordForm,
  lineReleaseForm,
  instructorSimulatorForm,
  instructorFlightForm,
  longAbsenceForm,
  uprtQualificationForm,
  englishCertificateForm,
  discussionSubjectsForm,
  placeholder('line-form', 'D.O.A — LINE FORM', 'Line Form', 'Suivi de vol en ligne', 'Ligne', '#17AE96', 'report'),
  placeholder('skill-test', 'D.O.A — SKILL TEST', 'Skill Test', 'Épreuve pratique de qualification de type', 'Examen', '#2F63D8', 'skill'),
  placeholder('remedial', 'D.O.A — REMEDIAL', 'Remedial Training', 'Entraînement de remédiation', 'Remédiation', '#C93FAE', 'remedial'),
]

export const CATEGORIES: FormDef['category'][] = ['Ligne', 'Simulateur', 'Examen', 'Remédiation']

export function getForm(id: string): FormDef | undefined {
  return FORMS.find((f) => f.id === id)
}
