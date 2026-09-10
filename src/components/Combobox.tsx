import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Suggestion } from '../types/form'

interface Props {
  id: string
  value: string
  options: Suggestion[]
  placeholder?: string
  ariaLabel?: string
  className?: string
  /** Met la saisie en majuscules (codes d'aéroport, immatriculations). */
  uppercase?: boolean
  onChange: (value: string) => void
}

/** Nombre d'entrées visibles avant défilement. */
const VISIBLES = 8

/**
 * Saisie assistée.
 *
 * On tape, la liste se réduit aux codes qui correspondent ; on choisit d'un
 * doigt. Rien n'oblige à prendre dans la liste : un vol charter ou un terrain
 * exceptionnel s'écrit directement, et la valeur est conservée telle quelle.
 *
 * La liste est rendue au niveau de la page : elle n'est donc pas rognée par le
 * défilement horizontal d'un tableau.
 */
export function Combobox({
  id,
  value,
  options,
  placeholder,
  ariaLabel,
  className,
  uppercase,
  onChange,
}: Props) {
  const champ = useRef<HTMLInputElement>(null)
  const [ouvert, setOuvert] = useState(false)
  const [actif, setActif] = useState(0)
  const [cadre, setCadre] = useState<{ top: number; left: number; width: number } | null>(null)

  const entrees = options.map((o) => (typeof o === 'string' ? { value: o, hint: undefined } : o))
  const requete = value.trim().toUpperCase()
  const sansAccent = (texte: string) =>
    texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()

  // Le code d'abord, la ville ensuite : « ORA » comme « Oran » mènent à ORN.
  const filtres = requete
    ? [
        ...entrees.filter((o) => o.value.toUpperCase().startsWith(requete)),
        ...entrees.filter(
          (o) =>
            !o.value.toUpperCase().startsWith(requete) &&
            (o.value.toUpperCase().includes(requete) || sansAccent(o.hint ?? '').includes(sansAccent(requete))),
        ),
      ]
    : entrees

  const placer = () => {
    const boite = champ.current?.getBoundingClientRect()
    if (boite) setCadre({ top: boite.bottom + 4, left: boite.left, width: boite.width })
  }

  useLayoutEffect(() => {
    if (ouvert) placer()
  }, [ouvert, value])

  useEffect(() => {
    if (!ouvert) return
    // Un défilement ou une rotation déplace le champ : la liste suit.
    const suivre = () => placer()
    window.addEventListener('scroll', suivre, true)
    window.addEventListener('resize', suivre)
    return () => {
      window.removeEventListener('scroll', suivre, true)
      window.removeEventListener('resize', suivre)
    }
  }, [ouvert])

  const choisir = (option: string) => {
    onChange(option)
    setOuvert(false)
  }

  return (
    <div className="combo">
      <input
        ref={champ}
        id={id}
        className={className ?? 'input'}
        role="combobox"
        aria-expanded={ouvert}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize={uppercase ? 'characters' : undefined}
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          setActif(0)
          setOuvert(true)
        }}
        onBlur={() => setTimeout(() => setOuvert(false), 120)}
        onChange={(e) => {
          onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)
          setActif(0)
          setOuvert(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOuvert(true)
            setActif((i) => Math.min(i + 1, filtres.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActif((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter' && ouvert && filtres[actif]) {
            e.preventDefault()
            choisir(filtres[actif].value)
          } else if (e.key === 'Escape') {
            setOuvert(false)
          }
        }}
      />

      {ouvert && cadre && filtres.length > 0 &&
        createPortal(
          <ul
            className="combo-list"
            style={{ top: cadre.top, left: cadre.left, width: cadre.width, maxHeight: VISIBLES * 38 }}
          >
            {filtres.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`combo-option${index === actif ? ' on' : ''}`}
                  // On agit avant la perte de focus, sinon la liste se referme.
                  onPointerDown={(e) => {
                    e.preventDefault()
                    choisir(option.value)
                  }}
                >
                  <span className="combo-code">{option.value}</span>
                  {option.hint && <span className="combo-hint">{option.hint}</span>}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  )
}
