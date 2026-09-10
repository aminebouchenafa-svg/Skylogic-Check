import type { ReactElement } from 'react'
import {
  IconAirfield,
  IconCertificate,
  IconCommand,
  IconConfidential,
  IconLineCheck,
  IconNotification,
  IconRemedial,
  IconReport,
  IconRnav,
  IconSimulator,
  IconSkill,
  IconSyllabus,
  IconTraining,
} from './Icons'

/** Association entre la clé d'un formulaire et son pictogramme sur l'accueil. */
export const FORM_ICONS: Record<string, (props: { size?: number }) => ReactElement> = {
  'line-check': IconLineCheck,
  training: IconTraining,
  simulator: IconSimulator,
  report: IconReport,
  skill: IconSkill,
  remedial: IconRemedial,
  notification: IconNotification,
  certificate: IconCertificate,
  command: IconCommand,
  rnav: IconRnav,
  confidential: IconConfidential,
  airfield: IconAirfield,
  syllabus: IconSyllabus,
}
