/** Identifiant d'une cellule de tableau de saisie. */
export const cellId = (matrixId: string, rowId: string, colId: string) =>
  `${matrixId}_${rowId}_${colId}`

/** Identifiant d'une case à cocher d'une liste (item × colonne). */
export const tickId = (itemId: string, columnId: string) => `${itemId}_${columnId}`

/** Identifiant d'une note portée sur une colonne donnée (ex. un secteur). */
export const gradeId = (itemId: string, columnId: string) => `${itemId}_${columnId}`

/** Identifiant de la n-ième réponse d'un questionnaire. */
export const answerId = (sectionId: string, index: number) => `${sectionId}_q${index}`
