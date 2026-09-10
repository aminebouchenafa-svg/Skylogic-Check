/** Identifiant d'une cellule de tableau de saisie. */
export const cellId = (matrixId: string, rowId: string, colId: string) =>
  `${matrixId}_${rowId}_${colId}`

/** Identifiant d'une case à cocher d'une liste (item × colonne). */
export const tickId = (itemId: string, columnId: string) => `${itemId}_${columnId}`
