import { useState } from 'react'

interface Props {
  id: string
  value: string
  options: string[]
  /** Autorise une valeur hors liste, saisie à la main. */
  allowOther?: boolean
  ariaLabel?: string
  className?: string
  onChange: (value: string) => void
}

const AUTRE = '__autre__'

/**
 * Choix dans une liste.
 *
 * Un menu déroulant natif : sur tablette il s'ouvre en molette, ce qu'aucune
 * liste de suggestions ne fait de façon fiable. Quand la liste ne suffit pas,
 * « Autre… » rend la saisie libre sans quitter le champ.
 */
export function Choice({ id, value, options, allowOther, ariaLabel, className, onChange }: Props) {
  const horsListe = Boolean(value) && !options.includes(value)
  const [autre, setAutre] = useState(horsListe)
  const libre = autre || horsListe

  return (
    <>
      <select
        id={id}
        className={className ?? 'select'}
        aria-label={ariaLabel}
        value={libre ? AUTRE : value}
        onChange={(e) => {
          if (e.target.value === AUTRE) {
            setAutre(true)
            onChange('')
            return
          }
          setAutre(false)
          onChange(e.target.value)
        }}
      >
        <option value="">— Sélectionner —</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {allowOther && <option value={AUTRE}>Autre…</option>}
      </select>

      {allowOther && libre && (
        <input
          className="input"
          style={{ marginTop: 8 }}
          aria-label={ariaLabel ? `${ariaLabel} — saisie libre` : 'Saisie libre'}
          placeholder="Saisir la valeur"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </>
  )
}
