import type { FormValues, GradedItemDef } from '../types/form'
import { tickId } from '../lib/ids'

interface Props {
  items: GradedItemDef[]
  columns: { id: string; label: string }[]
  values: FormValues
  onChange: (id: string, value: boolean) => void
}

/**
 * Liste à cocher : les items ne reçoivent pas de note, ils sont simplement
 * relevés dans l'une des colonnes (ex. CM 1 / CM 2).
 */
export function Checklist({ items, columns, values, onChange }: Props) {
  return (
    <div className="tick-list">
      <div className="tick-head">
        <span />
        {columns.map((column) => (
          <span key={column.id}>{column.label}</span>
        ))}
      </div>

      {items.map((item) =>
        item.heading ? (
          <div className="tick-heading" key={item.id}>
            {item.label}
          </div>
        ) : (
          <div className="tick-row" key={item.id}>
            <div>
              <span className="tick-label">{item.label}</span>
              {item.description && <span className="tick-desc"> {item.description}</span>}
            </div>
            {columns.map((column) => {
              const key = tickId(item.id, column.id)
              const on = Boolean(values[key])
              return (
                <button
                  key={column.id}
                  type="button"
                  className={`tick-box${on ? ' on' : ''}`}
                  aria-label={`${item.label} — ${column.label}`}
                  aria-pressed={on}
                  onClick={() => onChange(key, !on)}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 5 5L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        ),
      )}
    </div>
  )
}
