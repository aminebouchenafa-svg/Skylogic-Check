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

/** Hauteur d'une entrée et marge du bord de l'écran, en pixels. */
const LIGNE = 44
const MARGE = 8

/**
 * Saisie assistée.
 *
 * On tape, la liste se réduit aux valeurs qui correspondent ; on choisit d'un
 * doigt. Rien n'oblige à prendre dans la liste : un vol charter ou un appareil
 * affrété s'écrit directement.
 *
 * Deux précautions pour l'usage au doigt : la liste ne se referme pas quand on
 * la fait défiler, et le choix se fait au relâchement — effleurer la liste en
 * la faisant glisser ne sélectionne rien. Elle se place au-dessus du champ
 * quand le clavier ne laisse pas la place en dessous.
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
  const liste = useRef<HTMLUListElement>(null)
  const [ouvert, setOuvert] = useState(false)
  const [actif, setActif] = useState(0)
  const [cadre, setCadre] = useState<{ top: number; left: number; width: number; max: number } | null>(
    null,
  )

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
            (o.value.toUpperCase().includes(requete) ||
              sansAccent(o.hint ?? '').includes(sansAccent(requete))),
        ),
      ]
    : entrees

  const placer = () => {
    const boite = champ.current?.getBoundingClientRect()
    if (!boite) return
    const hauteurVoulue = Math.min(filtres.length, 7) * LIGNE + 10
    const dessous = window.innerHeight - boite.bottom - MARGE
    const dessus = boite.top - MARGE
    // Sur téléphone, le clavier mange le bas de l'écran : la liste remonte.
    const auDessus = dessous < Math.min(hauteurVoulue, 160) && dessus > dessous
    const max = Math.max(120, Math.min(hauteurVoulue, auDessus ? dessus : dessous))
    const largeur = Math.min(boite.width, window.innerWidth - 2 * MARGE)
    const gauche = Math.max(MARGE, Math.min(boite.left, window.innerWidth - largeur - MARGE))
    setCadre({
      top: auDessus ? boite.top - max - 4 : boite.bottom + 4,
      left: gauche,
      width: largeur,
      max,
    })
  }

  useLayoutEffect(() => {
    if (ouvert) placer()
  }, [ouvert, value, filtres.length])

  useEffect(() => {
    if (!ouvert) return
    const suivre = () => placer()
    // Un geste ailleurs qu'au champ ou dans la liste referme celle-ci.
    const dehors = (e: PointerEvent) => {
      const cible = e.target as Node
      if (champ.current?.contains(cible) || liste.current?.contains(cible)) return
      setOuvert(false)
    }
    window.addEventListener('scroll', suivre, true)
    window.addEventListener('resize', suivre)
    document.addEventListener('pointerdown', dehors)
    return () => {
      window.removeEventListener('scroll', suivre, true)
      window.removeEventListener('resize', suivre)
      document.removeEventListener('pointerdown', dehors)
    }
  }, [ouvert])

  const choisir = (option: string) => {
    onChange(option)
    setOuvert(false)
    champ.current?.blur()
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
            ref={liste}
            className="combo-list"
            style={{ top: cadre.top, left: cadre.left, width: cadre.width, maxHeight: cadre.max }}
          >
            {filtres.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`combo-option${index === actif ? ' on' : ''}`}
                  // Au clic, donc au relâchement : faire défiler la liste du
                  // doigt ne choisit rien.
                  onClick={() => choisir(option.value)}
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
