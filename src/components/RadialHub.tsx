import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormDef } from '../types/form'
import { FORM_ICONS } from './formIcons'

interface Props {
  forms: FormDef[]
  onSelect: (form: FormDef) => void
  /** Texte affiché au centre quand aucun secteur n'est survolé. */
  centerLabel: string
  centerSub: string
  /**
   * Au-delà de ce nombre de formulaires, la roue passe à deux niveaux :
   * les familles d'abord, les formulaires de la famille ensuite.
   */
  familyThreshold?: number
}

/** Un secteur de la roue : une famille ou un formulaire. */
interface Segment {
  key: string
  title: string
  sub: string
  accent: string
  icon: string
  pending: boolean
  open: () => void
}

const TAU = Math.PI * 2

/** Pictogramme et couleur de chaque famille, quand la roue est à deux niveaux. */
const FAMILIES: Record<string, { icon: string; accent: string }> = {
  Ligne: { icon: 'line-check', accent: '#0E9BF0' },
  Simulateur: { icon: 'simulator', accent: '#E8B93B' },
  Examen: { icon: 'command', accent: '#E0518B' },
  Remédiation: { icon: 'remedial', accent: '#7C5CE0' },
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

/** Chemin d'un secteur d'anneau, avec un retrait angulaire pour l'espacement. */
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

/** Arc simple, utilisé pour les arêtes lumineuses du relief. */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p1 = polar(cx, cy, r, a0)
  const p2 = polar(cx, cy, r, a1)
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`
}

function mix(hex: string, target: number, ratio: number): string {
  const h = hex.replace('#', '')
  const channels = [0, 2, 4].map((i) => {
    const value = parseInt(h.slice(i, i + 2), 16)
    return Math.round(value + (target - value) * ratio)
  })
  return `#${channels.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

const lighten = (hex: string, ratio: number) => mix(hex, 255, ratio)
const darken = (hex: string, ratio: number) => mix(hex, 0, ratio)

/** Un secteur en attente garde sa couleur, mais éteinte. */
const segColor = (segment: Segment) => (segment.pending ? mix(segment.accent, 72, 0.42) : segment.accent)

/**
 * Accueil radial : un secteur coloré par formulaire, pictogramme et titre.
 * L'anneau est traité en relief — dégradé du bord intérieur vers l'extérieur,
 * arête claire au-dessus, ombre portée au-dessous — et chaque secteur projette
 * un faisceau jusqu'au bord du cadre.
 *
 * Passé un certain nombre de formulaires, la roue affiche d'abord les familles
 * puis les formulaires de la famille choisie : les titres restent lisibles.
 */
export function RadialHub({
  forms,
  onSelect,
  centerLabel,
  centerSub,
  familyThreshold = 8,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(560)
  const [hover, setHover] = useState<number | null>(null)
  /** Famille ouverte, quand la roue est à deux niveaux. */
  const [family, setFamily] = useState<string | null>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.max(300, Math.min(entry.contentRect.width, 620)))
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  const twoLevel = forms.length > familyThreshold

  const segments = useMemo<Segment[]>(() => {
    const asSegment = (form: FormDef): Segment => ({
      key: form.id,
      title: form.title,
      sub: form.pending ? 'En attente' : form.category,
      accent: form.accent,
      icon: form.icon,
      pending: Boolean(form.pending),
      open: () => onSelect(form),
    })

    if (!twoLevel) return forms.map(asSegment)
    if (family) return forms.filter((f) => f.category === family).map(asSegment)

    // Premier niveau : une famille par secteur, dans l'ordre du catalogue.
    const ordre: string[] = []
    for (const form of forms) if (!ordre.includes(form.category)) ordre.push(form.category)

    return ordre.map((categorie) => {
      const membres = forms.filter((f) => f.category === categorie)
      const actifs = membres.filter((f) => !f.pending).length
      return {
        key: categorie,
        title: categorie,
        sub: actifs > 0 ? `${actifs} formulaire${actifs > 1 ? 's' : ''}` : 'En attente',
        accent: FAMILIES[categorie]?.accent ?? membres[0].accent,
        icon: FAMILIES[categorie]?.icon ?? membres[0].icon,
        pending: actifs === 0,
        open: () => {
          setFamily(categorie)
          setHover(null)
        },
      }
    })
  }, [forms, family, twoLevel, onSelect])

  const c = size / 2
  const innerR = size * 0.163
  const ringR = size * 0.325
  const beamR = size * 0.8
  const gap = 0.02 * TAU
  const step = TAU / segments.length
  const scale = size / 560

  const active = hover !== null ? segments[hover] : null
  const retour = twoLevel && family !== null

  return (
    <div className="hub" ref={boxRef}>
      <div className="hub-stage" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hub-svg">
          <defs>
            <filter id="hub-lift" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy={7 * scale} stdDeviation={9 * scale} floodColor="#000" floodOpacity="0.6" />
            </filter>
            {segments.map((segment, index) => {
              const mid = -Math.PI / 2 + index * step
              const from = polar(c, c, innerR, mid)
              const to = polar(c, c, beamR, mid)
              const base = segColor(segment)
              return (
                <g key={segment.key}>
                  {/* Relief du secteur : clair au bord intérieur, sombre au bord extérieur. */}
                  <linearGradient
                    id={`ring-${segment.key}`}
                    gradientUnits="userSpaceOnUse"
                    x1={from.x}
                    y1={from.y}
                    x2={polar(c, c, ringR, mid).x}
                    y2={polar(c, c, ringR, mid).y}
                  >
                    <stop offset="0%" stopColor={lighten(base, 0.34)} />
                    <stop offset="52%" stopColor={base} />
                    <stop offset="100%" stopColor={darken(base, 0.34)} />
                  </linearGradient>
                  {/* Faisceau : dense au départ de l'anneau, éteint au bord du cadre. */}
                  <linearGradient
                    id={`beam-${segment.key}`}
                    gradientUnits="userSpaceOnUse"
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                  >
                    <stop offset="0%" stopColor={base} stopOpacity={segment.pending ? 0.3 : 0.46} />
                    <stop offset="55%" stopColor={base} stopOpacity={segment.pending ? 0.16 : 0.24} />
                    <stop offset="100%" stopColor={base} stopOpacity="0" />
                  </linearGradient>
                </g>
              )
            })}
          </defs>

          {/* Faisceaux, sous l'anneau */}
          {segments.map((segment, index) => {
            const a0 = -Math.PI / 2 - step / 2 + index * step
            const a1 = a0 + step
            const edge0 = polar(c, c, ringR + 5 * scale, a0 + gap)
            const edge1 = polar(c, c, beamR, a0 + gap)
            return (
              <g
                key={segment.key}
                className={`hub-seg${segment.pending ? ' pending' : ''}${hover === index ? ' lit' : ''}`}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover((h) => (h === index ? null : h))}
                onClick={() => !segment.pending && segment.open()}
              >
                <path
                  d={wedgePath(c, c, ringR + 5 * scale, beamR, a0 + gap, a1 - gap)}
                  fill={`url(#beam-${segment.key})`}
                />
                <path
                  d={`M ${edge0.x} ${edge0.y} L ${edge1.x} ${edge1.y}`}
                  stroke={lighten(segColor(segment), 0.3)}
                  strokeOpacity={segment.pending ? 0.22 : 0.75}
                  strokeWidth={1.2 * scale}
                  fill="none"
                />
              </g>
            )
          })}

          {/* Anneau en relief */}
          <g filter="url(#hub-lift)">
            {segments.map((segment, index) => {
              const a0 = -Math.PI / 2 - step / 2 + index * step
              const a1 = a0 + step
              return (
                <g
                  key={segment.key}
                  className={`hub-seg${segment.pending ? ' pending' : ''}${hover === index ? ' lit' : ''}`}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover((h) => (h === index ? null : h))}
                  onClick={() => !segment.pending && segment.open()}
                >
                  <path
                    className="hub-ring"
                    d={wedgePath(c, c, innerR, ringR, a0 + gap, a1 - gap)}
                    fill={`url(#ring-${segment.key})`}
                  />
                  {/* Arête claire du bord intérieur */}
                  <path
                    d={arcPath(c, c, innerR + 0.8 * scale, a0 + gap, a1 - gap)}
                    stroke={lighten(segColor(segment), 0.55)}
                    strokeOpacity={segment.pending ? 0.2 : 0.6}
                    strokeWidth={1.6 * scale}
                    fill="none"
                  />
                  {/* Ombre du bord extérieur, qui donne l'épaisseur */}
                  <path
                    d={arcPath(c, c, ringR - 1 * scale, a0 + gap, a1 - gap)}
                    stroke="#000"
                    strokeOpacity="0.3"
                    strokeWidth={2 * scale}
                    fill="none"
                  />
                </g>
              )
            })}
          </g>

          {/* Puits central */}
          <circle cx={c} cy={c} r={innerR - 2 * scale} className="hub-well" />
          <circle cx={c} cy={c} r={innerR - 5 * scale} className="hub-core" />
        </svg>

        <button
          type="button"
          className={`hub-center${retour ? ' back' : ''}`}
          style={{ width: innerR * 1.85, height: innerR * 1.85 }}
          onClick={() => retour && setFamily(null)}
          disabled={!retour}
        >
          <div className="hub-center-title" style={{ fontSize: 15 * scale }}>
            {active ? active.title : retour ? family : centerLabel}
          </div>
          <div className="hub-center-sub" style={{ fontSize: 9.5 * scale }}>
            {active ? active.sub : retour ? 'Toutes les familles' : centerSub}
          </div>
        </button>

        {segments.map((segment, index) => {
          const mid = -Math.PI / 2 + index * step
          const iconPos = polar(c, c, ringR, mid)
          // Le libellé se pose juste au-dessus du pictogramme dans la moitié
          // haute, juste en dessous dans la moitié basse : il reste toujours
          // dans le cadre, quelle que soit sa longueur.
          const labelW = 132 * scale
          const above = Math.sin(mid) < 0
          const labelX = Math.min(Math.max(iconPos.x, labelW / 2 + 8), size - labelW / 2 - 8)
          const labelY = iconPos.y + (above ? -1 : 1) * (34 * scale + 9)
          const Icon = FORM_ICONS[segment.icon] ?? FORM_ICONS.report
          return (
            <div key={segment.key} className="hub-item">
              <button
                type="button"
                className={`hub-badge${segment.pending ? ' pending' : ''}${hover === index ? ' lit' : ''}`}
                style={{
                  left: iconPos.x,
                  top: iconPos.y,
                  width: 60 * scale,
                  height: 60 * scale,
                  ['--seg' as string]: segment.accent,
                  ['--seg-light' as string]: lighten(segment.accent, 0.45),
                  ['--seg-dark' as string]: darken(segment.accent, 0.4),
                }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover((h) => (h === index ? null : h))}
                onClick={() => !segment.pending && segment.open()}
                disabled={segment.pending}
                aria-label={segment.title}
              >
                <Icon size={27 * scale} />
              </button>
              <div
                className={`hub-label ${above ? 'above' : 'below'}${segment.pending ? ' pending' : ''}`}
                style={{ left: labelX, top: labelY, width: labelW, fontSize: 12.5 * scale }}
              >
                {segment.title}
                <span style={{ fontSize: 9 * scale }}>{segment.sub}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
