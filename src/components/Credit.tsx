/** Auteur de l'application. */
export const AUTHOR = 'CPT BOUCHENAFA M.A'

/** Signature, au pied de l'écran de connexion. */
export function Credit({ className }: { className?: string }) {
  return (
    <div className={className ? `credit ${className}` : 'credit'}>
      Dev by <strong>{AUTHOR}</strong>
    </div>
  )
}
