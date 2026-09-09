/**
 * Schéma déclaratif des formulaires SKYLOGIC CHECK.
 *
 * Chaque formulaire officiel (Line Check, LPC/OPC, Skill Test, Remedial...) est
 * décrit ici sous forme de données. L'interface de saisie, le code couleur,
 * la validation et l'export PDF sont générés automatiquement à partir de cette
 * description : ajouter un formulaire = ajouter un fichier dans src/forms/.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'time'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'signature'

export type FieldWidth = 'full' | 'half' | 'third' | 'quarter'

export interface FieldDef {
  id: string
  label: string
  type: FieldType
  width?: FieldWidth
  options?: string[]
  placeholder?: string
  hint?: string
  required?: boolean
  /** Valeur pré-remplie à l'ouverture du formulaire. */
  defaultValue?: string | number | boolean
}

/** Un item noté dans une grille d'évaluation. */
export interface GradedItemDef {
  id: string
  /** Référence officielle de l'item (ex. « 2.1 », « COM »). */
  code?: string
  label: string
  /** Indicateurs de performance affichés en aide à la notation. */
  description?: string
  /** Autorise « N/A » sur cet item (par défaut : oui). */
  allowNA?: boolean
}

export type SectionKind =
  | 'identification'
  | 'grading'
  | 'notes'
  | 'checklist'
  | 'signature'

export interface SectionDef {
  id: string
  title: string
  subtitle?: string
  kind: SectionKind
  /** Champs libres (identification, notes, signatures). */
  fields?: FieldDef[]
  /** Items notés (sections d'évaluation). */
  items?: GradedItemDef[]
  /** Échelle de notation utilisée par la section (défaut : celle du formulaire). */
  scaleId?: string
  /** Commentaire libre attaché à la grille. */
  commentField?: { id: string; label: string; placeholder?: string }
}

export interface GradeLevel {
  /** Valeur stockée et imprimée (1..5, S/U, etc.). */
  value: string
  /** Libellé court affiché dans le bouton. */
  short: string
  label: string
  description?: string
  /** Couleur du code couleur (hex). */
  color: string
  /** Considéré comme non satisfaisant → déclenche l'alerte du formulaire. */
  failing?: boolean
}

export interface GradeScale {
  id: string
  name: string
  levels: GradeLevel[]
  allowNA?: boolean
}

export type FormStatus = 'draft' | 'completed'

export interface FormDef {
  id: string
  /** Référence document (ex. « FTM-LC-01 »). */
  code: string
  title: string
  subtitle?: string
  category: 'Ligne' | 'Simulateur' | 'Examen' | 'Remédiation'
  revision: string
  /** Couleur d'accent du formulaire (code couleur de l'app). */
  accent: string
  scaleId: string
  sections: SectionDef[]
  /** Indisponible tant que le modèle officiel n'a pas été intégré. */
  pending?: boolean
}

export type FormValues = Record<string, string | number | boolean | null>

export interface FormRecord {
  id: string
  formId: string
  formCode: string
  formTitle: string
  /** Nom du stagiaire / commandant évalué, pour l'archive. */
  subject: string
  status: FormStatus
  values: FormValues
  createdAt: string
  updatedAt: string
}
