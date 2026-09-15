/** Auteur de l'application. L'année se met à jour d'elle-même. */
export const AUTHOR = 'CPT BOUCHENAFA M.A'

/**
 * Mention d'auteur et de droits, au pied de l'application et sur l'écran de
 * connexion. Elle reste lisible sur téléphone, là où le pavé latéral disparaît.
 */
export function Credit({ className }: { className?: string }) {
  return (
    <div className={className ? `credit ${className}` : 'credit'}>
      <span className="credit-line">
        Application développée par <strong>{AUTHOR}</strong>
      </span>
      <span className="credit-rights">
        © {new Date().getFullYear()} {AUTHOR} — Tous droits réservés
      </span>
    </div>
  )
}
