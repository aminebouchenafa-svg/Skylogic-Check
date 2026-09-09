import type { GradeScale, GradedItemDef } from '../types/form'
import { NA_COLOR } from '../forms/scales'

interface Props {
  item: GradedItemDef
  scale: GradeScale
  value: string
  onChange: (value: string) => void
}

/** Une ligne de notation : l'item, ses indicateurs, et les boutons du code couleur. */
export function GradeRow({ item, scale, value, onChange }: Props) {
  const toggle = (next: string) => onChange(value === next ? '' : next)

  return (
    <div className="grade-row">
      <div className="grade-code">{item.code ?? ''}</div>
      <div>
        <div className="grade-label">{item.label}</div>
        {item.description && <div className="grade-desc">{item.description}</div>}
      </div>
      <div className="grade-buttons">
        {scale.levels.map((level) => (
          <button
            key={level.value}
            type="button"
            title={`${level.label} — ${level.description ?? ''}`}
            className={`grade-btn${value === level.value ? ' on' : ''}`}
            style={{ ['--btn-color' as string]: level.color }}
            onClick={() => toggle(level.value)}
          >
            {level.short}
          </button>
        ))}
        {scale.allowNA && item.allowNA !== false && (
          <button
            type="button"
            title="Non applicable"
            className={`grade-btn na${value === 'NA' ? ' on' : ''}`}
            style={{ ['--btn-color' as string]: NA_COLOR }}
            onClick={() => toggle('NA')}
          >
            N/A
          </button>
        )}
      </div>
    </div>
  )
}
