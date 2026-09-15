import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { parseDuration } from '../lib/totals'

interface Props {
  id: string
  value: string
  ariaLabel?: string
  className?: string
  /** Heure la plus haute proposée par la molette (99 par défaut). */
  maxHours?: number
  onChange: (value: string) => void
}

/** Hauteur d'une graduation, en pixels. Trois sont visibles à la fois. */
const CRAN = 44
const VISIBLES = 3

/**
 * Une seule molette ouverte à la fois : celle qui s'ouvre referme la
 * précédente. Le voile couvre l'écran, deux molettes empilées n'auraient
 * aucun sens.
 */
let fermerPrecedente: (() => void) | null = null

/**
 * Lit la valeur enregistrée. Une durée « h:mm » se lit telle quelle ; un
 * nombre seul, saisi au clavier avant la molette, compte pour des heures,
 * comme le font déjà les totaux de colonne.
 */
function lireDuree(value: string): number | null {
  const enMinutes = parseDuration(value)
  if (enMinutes !== null) return enMinutes
  const nombre = Number(value.trim().replace(',', '.'))
  if (value.trim() && Number.isFinite(nombre) && nombre >= 0) return Math.round(nombre * 60)
  return null
}

/**
 * Saisie d'une durée à la molette.
 *
 * Le champ n'appelle pas le clavier : on le touche, deux molettes montent —
 * les heures, les minutes — et l'on fait défiler comme sur la roue d'un
 * réveil. La valeur est enregistrée « h:mm », la forme que les totaux de
 * colonne savent déjà additionner.
 */
export function DurationPicker({ id, value, ariaLabel, className, maxHours = 99, onChange }: Props) {
  const [ouvert, setOuvert] = useState(false)
  const minutesTotal = lireDuree(value)
  const heures = minutesTotal === null ? 0 : Math.floor(minutesTotal / 60)
  const minutes = minutesTotal === null ? 0 : minutesTotal % 60

  // Tant que la molette est ouverte, la page dessous ne défile pas avec elle.
  useEffect(() => {
    if (!ouvert) return
    const avant = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fermerPrecedente = () => setOuvert(false)
    return () => {
      document.body.style.overflow = avant
      if (fermerPrecedente) fermerPrecedente = null
    }
  }, [ouvert])

  const poser = (h: number, m: number) => onChange(`${h}:${String(m).padStart(2, '0')}`)

  return (
    <>
      <button
        id={id}
        type="button"
        className={className ? `input duration-field ${className}` : 'input duration-field'}
        aria-label={ariaLabel}
        onClick={() => {
          fermerPrecedente?.()
          setOuvert(true)
        }}
      >
        {value ? (
          value
        ) : (
          <span className="duration-empty">‑‑:‑‑</span>
        )}
      </button>

      {ouvert &&
        createPortal(
          <div className="wheel-backdrop" onPointerDown={() => setOuvert(false)}>
            <div
              className="wheel-sheet"
              role="dialog"
              aria-label={ariaLabel ? `${ariaLabel} — durée` : 'Durée'}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="wheel-head">{ariaLabel ?? 'Durée'}</div>

              <div className="wheel-row">
                <Molette
                  legende="Heures"
                  valeurs={Array.from({ length: maxHours + 1 }, (_, i) => i)}
                  valeur={heures}
                  format={(n) => String(n)}
                  onChange={(h) => poser(h, minutes)}
                />
                <span className="wheel-colon">:</span>
                <Molette
                  legende="Minutes"
                  valeurs={Array.from({ length: 60 }, (_, i) => i)}
                  valeur={minutes}
                  format={(n) => String(n).padStart(2, '0')}
                  onChange={(m) => poser(heures, m)}
                />
              </div>

              <div className="wheel-foot">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    onChange('')
                    setOuvert(false)
                  }}
                >
                  Effacer
                </button>
                <span className="spacer" />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // Toucher la molette sans rien faire défiler vaut 0:00.
                    if (minutesTotal === null) poser(heures, minutes)
                    setOuvert(false)
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

interface MoletteProps {
  legende: string
  valeurs: number[]
  valeur: number
  format: (n: number) => string
  onChange: (n: number) => void
}

/**
 * Une colonne de la molette. Le défilement est celui du navigateur, aimanté
 * cran par cran ; la graduation arrêtée au centre est la valeur retenue.
 */
function Molette({ legende, valeurs, valeur, format, onChange }: MoletteProps) {
  const piste = useRef<HTMLUListElement>(null)
  const minuterie = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Placement initial : la valeur courante arrive au centre sans animation.
  useEffect(() => {
    const el = piste.current
    if (!el) return
    const index = Math.max(0, valeurs.indexOf(valeur))
    el.scrollTop = index * CRAN
    // Au montage seulement : ensuite c'est le doigt qui commande.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const defile = () => {
    const el = piste.current
    if (!el) return
    if (minuterie.current) clearTimeout(minuterie.current)
    // On attend l'arrêt : inutile de retenir les crans traversés au passage.
    minuterie.current = setTimeout(() => {
      const index = Math.min(valeurs.length - 1, Math.max(0, Math.round(el.scrollTop / CRAN)))
      const choisi = valeurs[index]
      if (choisi !== valeur) onChange(choisi)
    }, 120)
  }

  const viser = (n: number) => {
    const el = piste.current
    if (!el) return
    el.scrollTo({ top: valeurs.indexOf(n) * CRAN, behavior: 'smooth' })
    onChange(n)
  }

  return (
    <div className="wheel">
      <div className="wheel-legend">{legende}</div>
      <div className="wheel-window" style={{ height: CRAN * VISIBLES }}>
        <div className="wheel-band" style={{ height: CRAN, top: CRAN }} />
        <ul
          ref={piste}
          className="wheel-track"
          style={{ paddingBlock: CRAN }}
          onScroll={defile}
          tabIndex={0}
          role="listbox"
          aria-label={legende}
          onKeyDown={(e) => {
            const i = valeurs.indexOf(valeur)
            if (e.key === 'ArrowDown' && i < valeurs.length - 1) { e.preventDefault(); viser(valeurs[i + 1]) }
            if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); viser(valeurs[i - 1]) }
          }}
        >
          {valeurs.map((n) => (
            <li
              key={n}
              className={n === valeur ? 'wheel-item on' : 'wheel-item'}
              style={{ height: CRAN }}
              role="option"
              aria-selected={n === valeur}
              onClick={() => viser(n)}
            >
              {format(n)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
