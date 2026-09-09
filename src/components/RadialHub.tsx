import { useLayoutEffect, useRef, useState } from 'react'
import type { FormDef } from '../types/form'
import { FORM_ICONS } from './formIcons'

interface Props {
  forms: FormDef[]
  onSelect: (form: FormDef) => void
  /** Texte affiché au centre quand aucun secteur n'est survolé. */
  centerLabel: string
  centerSub: string
}

const TAU = Math.PI * 2

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

/** Chemin d'un secteur d'anneau, avec un léger retrait angulaire pour l'espacement. */
function wedgePath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const p1 = polar(cx, cy, r1, a0)
  const p2 = polar(cx, cy, r1, a1)
  const p3 = polar(cx, cy, r0, a1)
  const p4 = polar(cx, cy, r0, a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r1} ${r1} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${r0} ${r0} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

/**
 * Accueil radial : un secteur coloré par formulaire, pictogramme et titre.
 * Le centre affiche le formulaire survolé ; un clic ouvre la saisie.
 */
export function RadialHub({ forms, onSelect, centerLabel, centerSub }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(560)
  const [hover, setHover] = useState<number | null>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setSize(Math.max(300, Math.min(width, 620)))
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  const c = size / 2
  const innerR = size * 0.155
  const ringR = size * 0.3
  const beamR = size * 0.78
  const gap = 0.018 * TAU
  const step = TAU / forms.length
  const scale = size / 560

  const active = hover !== null ? forms[hover] : null

  return (
    <div className="hub" ref={boxRef}>
      <div className="hub-stage" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hub-svg">
          <defs>
            {forms.map((form) => (
              <radialGradient key={form.id} id={`beam-${form.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="35%" stopColor={form.accent} stopOpacity={form.pending ? 0.16 : 0.34} />
                <stop offset="100%" stopColor={form.accent} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {forms.map((form, index) => {
            const a0 = -Math.PI / 2 - step / 2 + index * step
            const a1 = a0 + step
            const lit = hover === index
            return (
              <g
                key={form.id}
                className={`hub-seg${form.pending ? ' pending' : ''}${lit ? ' lit' : ''}`}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover((h) => (h === index ? null : h))}
                onClick={() => !form.pending && onSelect(form)}
              >
                {/* Faisceau extérieur */}
                <path
                  d={wedgePath(c, c, ringR + 4 * scale, beamR, a0 + gap, a1 - gap)}
                  fill={`url(#beam-${form.id})`}
                />
                {/* Arête lumineuse du faisceau */}
                <path
                  d={`M ${polar(c, c, ringR + 4 * scale, a0 + gap).x} ${polar(c, c, ringR + 4 * scale, a0 + gap).y} L ${polar(c, c, beamR, a0 + gap).x} ${polar(c, c, beamR, a0 + gap).y}`}
                  stroke={form.accent}
                  strokeOpacity={form.pending ? 0.25 : 0.7}
                  strokeWidth={1.2}
                  fill="none"
                />
                {/* Secteur de l'anneau */}
                <path
                  className="hub-ring"
                  d={wedgePath(c, c, innerR, ringR, a0 + gap, a1 - gap)}
                  fill={form.accent}
                  fillOpacity={form.pending ? 0.28 : 1}
                />
              </g>
            )
          })}

          <circle cx={c} cy={c} r={innerR - 5 * scale} className="hub-core" />
        </svg>

        <div className="hub-center" style={{ width: innerR * 1.9, height: innerR * 1.9 }}>
          <div className="hub-center-title" style={{ fontSize: 15 * scale }}>
            {active ? active.title : centerLabel}
          </div>
          <div className="hub-center-sub" style={{ fontSize: 9.5 * scale }}>
            {active ? (active.pending ? 'En attente du modèle' : active.category) : centerSub}
          </div>
        </div>

        {forms.map((form, index) => {
          const mid = -Math.PI / 2 + index * step
          const iconPos = polar(c, c, ringR, mid)
          const labelPos = polar(c, c, ringR + 74 * scale, mid)
          const Icon = FORM_ICONS[form.icon] ?? FORM_ICONS.report
          return (
            <div key={form.id} className="hub-item">
              <button
                type="button"
                className={`hub-badge${form.pending ? ' pending' : ''}${hover === index ? ' lit' : ''}`}
                style={{
                  left: iconPos.x,
                  top: iconPos.y,
                  width: 56 * scale,
                  height: 56 * scale,
                  ['--seg' as string]: form.accent,
                }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover((h) => (h === index ? null : h))}
                onClick={() => !form.pending && onSelect(form)}
                disabled={form.pending}
                aria-label={form.title}
              >
                <Icon size={26 * scale} />
              </button>
              <div
                className={`hub-label${form.pending ? ' pending' : ''}`}
                style={{
                  left: labelPos.x,
                  top: labelPos.y,
                  width: 132 * scale,
                  fontSize: 12.5 * scale,
                }}
              >
                {form.title}
                <span style={{ fontSize: 9 * scale }}>{form.pending ? 'En attente' : form.category}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
