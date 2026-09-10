import type { FormValues, GradedItemDef } from '../types/form'
import { tickId } from '../lib/ids'

interface Props {
  items: GradedItemDef[]
  columns: { id: string; label: string; color?: string }[]
  values: FormValues
  onChange: (id: string, value: boolean | string) => void
  /** Une seule colonne cochable par ligne. */
  exclusive?: boolean
  /** Colonnes de saisie après les cases (ex. une date de réalisation). */
  trailing?: { id: string; label: string; type?: string }[]
}

/**
 * Liste à cocher : les items ne reçoivent pas de note, ils sont simplement
 * relevés dans l'une des colonnes (ex. CM 1 / CM 2).
 */
export function Checklist({ items, columns, values, onChange, exclusive, trailing = [] }: Props) {
  const gabarit = {
    gridTemplateColumns: `1fr repeat(${columns.length}, var(--tick-cols))${
      trailing.length ? ` repeat(${trailing.length}, minmax(130px, 1fr))` : ''
    }`,
  }

  return (
    <div className="tick-list">
      <div className="tick-head" style={gabarit}>
        <span />
        {columns.map((column) => (
          <span key={column.id}>{column.label}</span>
        ))}
        {trailing.map((column) => (
          <span key={column.id}>{column.label}</span>
        ))}
      </div>

      {items.map((item) =>
        item.heading ? (
          <div className="tick-heading" key={item.id}>
            {item.label}
          </div>
        ) : (
          <div className="tick-row" key={item.id} style={gabarit}>
            <div>
              <span className="tick-label">{item.label}</span>
              {item.description && <span className="tick-desc"> {item.description}</span>}
            </div>
            {columns.map((column) => {
              const key = tickId(item.id, column.id)
              const on = Boolean(values[key])
              return (
                <span className="tick-cell" key={column.id}>
                <button
                  type="button"
                  className={`tick-box${on ? ' on' : ''}`}
                  style={column.color ? { ['--tick' as string]: column.color } : undefined}
                  aria-label={`${item.label} — ${column.label}`}
                  aria-pressed={on}
                  onClick={() => {
                    if (exclusive && !on) {
                      for (const autre of columns) {
                        if (autre.id !== column.id) onChange(tickId(item.id, autre.id), false)
                      }
                    }
                    onChange(key, !on)
                  }}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12.5 5 5L19 7" />
                    </svg>
                  )}
                </button>
                  <span className="tick-cell-label">{column.label}</span>
                </span>
              )
            })}
            {trailing.map((column) => {
              const key = tickId(item.id, column.id)
              return (
                <input
                  key={column.id}
                  id={key}
                  className="input tick-extra"
                  type={column.type ?? 'text'}
                  aria-label={`${item.label} — ${column.label}`}
                  value={String(values[key] ?? '')}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              )
            })}
          </div>
        ),
      )}
    </div>
  )
}
