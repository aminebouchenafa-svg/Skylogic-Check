/**
 * Schéma déclaratif des formulaires SKYLOGIC CHECK.
 *
 * Chaque formulaire officiel est décrit ici sous forme de données : l'écran de
 * saisie, le code couleur, la validation et l'export PDF en sont déduits.
 * Intégrer un nouveau formulaire = ajouter un fichier dans src/forms/.
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
  /** Préfixe non modifiable affiché devant la saisie (ex. « AH » pour un n° de vol). */
  prefix?: string
}

/** Un item noté dans une grille d'évaluation. */
export interface GradedItemDef {
  id: string
  /** Numérotation officielle de l'item (ex. « 1 », « 12 »). */
  code?: string
  label: string
  /** Indicateurs de performance affichés en aide à la notation. */
  description?: string
  /** Autorise « / » (non applicable) sur cet item. Par défaut : oui. */
  allowNA?: boolean
  /** Certaines lignes ne portent pas une note mais une date (ex. date d'approche sur avion). */
  input?: 'grade' | 'date' | 'text'
  /** Ligne d'intitulé de rubrique à l'intérieur d'une grille (PRE-FLIGHT, CRUISE…). */
  heading?: boolean
  /** Item mis en évidence sur le formulaire officiel. */
  emphasis?: boolean
}

/** Attestation : une phrase type dont certains passages sont à compléter. */
export interface StatementDef {
  /** Texte où chaque {identifiant} marque un passage à compléter. */
  template: string
  blanks: { id: string; label: string; size?: number }[]
}

/** Tableau à cellules libres (étapes, secteurs, temps de vol…). */
export interface MatrixDef {
  /** En-têtes groupés affichés au-dessus des colonnes. */
  groups?: { label: string; span: number }[]
  columns: { id: string; label: string; type?: FieldType; options?: string[]; prefix?: string }[]
  rows: { id: string; label: string }[]
  /** Masque la colonne des intitulés de ligne quand le tableau n'en a pas. */
  hideRowLabels?: boolean
  /** Note affichée sous le tableau. */
  note?: string
}

export type SectionKind =
  | 'identification'
  | 'grading'
  /** Liste à cocher : les items ne sont pas notés, ils sont relevés. */
  | 'checklist'
  /** Phrase d'attestation à compléter. */
  | 'statement'
  /** Tableau de référence, en lecture seule (barème détaillé). */
  | 'reference'
  | 'matrix'
  | 'notes'
  /** Bloc de commentaire suivi d'un visa nominatif. */
  | 'endorsement'
  | 'result'
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
  /** Tableau de saisie (sections « matrix »). */
  matrix?: MatrixDef
  /** Phrase d'attestation (sections « statement »). */
  statement?: StatementDef
  /** Choix unique mis en avant (sections « result »). */
  choices?: { value: string; label: string; color: string }[]
  /** Échelle de notation de la section (défaut : celle du formulaire). */
  scaleId?: string
  /** Commentaire libre attaché à la grille. */
  commentField?: { id: string; label: string; placeholder?: string }
  /** Colonnes à cocher des sections « checklist » (ex. CM 1 / CM 2). */
  tickColumns?: { id: string; label: string }[]
  /**
   * Colonnes de notation d'une grille : un item reçoit alors une note par
   * colonne (ex. un secteur de vol) au lieu d'une note unique.
   */
  gradeColumns?: { id: string; label: string }[]
  /** Lignes d'un tableau de référence (sections « reference »). */
  referenceRows?: { label: string; description: string; color?: string }[]
  /** Mention imprimée sous la section. */
  note?: string
  /** Nombre de couples libellé/valeur par ligne à l'impression (défaut : 2). */
  pairsPerRow?: number
  /**
   * Mise en page du PDF : les sections partageant le même « spread » sont
   * imprimées côte à côte, comme sur le formulaire papier.
   */
  spread?: string
  column?: 'left' | 'right'
}

export interface GradeLevel {
  /** Valeur stockée et imprimée. */
  value: string
  /** Libellé court affiché dans le bouton et dans la case du PDF. */
  short: string
  label: string
  description?: string
  color: string
  /** Note non satisfaisante → déclenche l'alerte et l'obligation de remarque. */
  failing?: boolean
}

export interface GradeScale {
  id: string
  name: string
  /** Rappel imprimé en tête de formulaire. */
  legend?: string
  levels: GradeLevel[]
  /** Niveau « non applicable », proposé en plus des notes. */
  na?: GradeLevel
}

export type FormStatus = 'draft' | 'completed'

export interface FormDef {
  id: string
  /** Référence document. */
  code: string
  title: string
  /** Intitulé exact porté par le document papier, imprimé en tête du PDF. */
  printTitle?: string
  subtitle?: string
  category: 'Ligne' | 'Simulateur' | 'Examen' | 'Remédiation'
  revision: string
  /** Couleur du formulaire : segment de l'accueil, écran et PDF. */
  accent: string
  /** Clé du pictogramme affiché sur l'accueil. */
  icon: string
  scaleId: string
  sections: SectionDef[]
  /** Mention réglementaire imprimée en bas du PDF. */
  reminder?: string
  /** Indisponible tant que le modèle officiel n'a pas été intégré. */
  pending?: boolean
}

export type FormValues = Record<string, string | number | boolean | null>

export interface FormRecord {
  id: string
  formId: string
  formCode: string
  formTitle: string
  /** Nom du candidat évalué, pour l'archive. */
  subject: string
  status: FormStatus
  values: FormValues
  createdAt: string
  updatedAt: string
}
