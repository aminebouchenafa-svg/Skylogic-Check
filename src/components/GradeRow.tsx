import type { GradeScale, GradedItemDef } from '../types/form'
import { selectableLevels } from '../forms/scales'

interface Props {
  item: GradedItemDef
  scale: GradeScale
  value: string
  onChange: (value: string) => void
}

/** Une ligne de notation : l'item et les boutons du code couleur. */
export function GradeRow({ item, scale, value, onChange }: Props) {
  const toggle = (next: string) => onChange(value === next ? '' : next)
  const levels = selectableLevels(scale).filter(
    (level) => level.value !== 'NA' || item.allowNA !== false,
  )

  return (
    <div className={`grade-row${item.code ? '' : ' nocode'}`}>
      {item.code && <div className="grade-code">{item.code}</div>}
      <div>
        <div className={`grade-label${item.emphasis ? ' emphasis' : ''}`}>{item.label}</div>
        {item.description && <div className="grade-desc">{item.description}</div>}
      </div>

      {item.input === 'date' ? (
        <input
          type="date"
          className="input"
          style={{ maxWidth: 190 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="grade-buttons">
          {levels.map((level) => (
            <button
              key={level.value}
              type="button"
              title={`${level.short} — ${level.label}${level.description ? ` : ${level.description}` : ''}`}
              className={`grade-btn${value === level.value ? ' on' : ''}`}
              style={{ ['--btn-color' as string]: level.color }}
              onClick={() => toggle(level.value)}
            >
              {level.short}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
