/** Identifiant d'une cellule de tableau de saisie. */
export const cellId = (matrixId: string, rowId: string, colId: string) =>
  `${matrixId}_${rowId}_${colId}`
