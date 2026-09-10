import type { FormValues, MatrixDef } from '../types/form'
import { cellId } from '../lib/ids'
import { columnTotal } from '../lib/totals'
import { SignaturePad } from './SignaturePad'

interface Props {
  id: string
  matrix: MatrixDef
  values: FormValues
  onChange: (id: string, value: string) => void
}

/** Tableau de saisie libre (étapes, secteurs, temps de vol…). */
export function Matrix({ id, matrix, values, onChange }: Props) {
  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <thead>
          {matrix.groups && (
            <tr>
              {!matrix.hideRowLabels && <th className="row-head" />}
              {matrix.groups.map((group) => (
                <th key={group.label} colSpan={group.span}>
                  {group.label}
                </th>
              ))}
            </tr>
          )}
          <tr>
            {!matrix.hideRowLabels && <th className="row-head" />}
            {matrix.columns.map((column) => (
              <th key={column.id}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.id}>
              {!matrix.hideRowLabels && <td className="row-label">{row.label}</td>}
              {matrix.columns.map((column) => {
                const key = cellId(id, row.id, column.id)
                const value = String(values[key] ?? '')
                if (row.computed) {
                  // Ligne de total : elle se lit, elle ne se saisit pas.
                  return (
                    <td key={column.id} className="matrix-total">
                      {column.type === 'signature' ? '' : columnTotal(id, matrix, column.id, values)}
                    </td>
                  )
                }
                return (
                  <td key={column.id} className={column.type === 'signature' ? 'matrix-sign' : undefined}>
                    {column.type === 'signature' ? (
                      <SignaturePad value={value} onChange={(data) => onChange(key, data)} compact />
                    ) : column.type === 'checkbox' ? (
                      <input
                        id={key}
                        type="checkbox"
                        className="matrix-tick"
                        checked={value === 'x'}
                        onChange={(e) => onChange(key, e.target.checked ? 'x' : '')}
                      />
                    ) : column.type === 'select' ? (
                      <select id={key} className="select input" value={value} onChange={(e) => onChange(key, e.target.value)}>
                        <option value="">—</option>
                        {column.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : column.prefix ? (
                      <div className="prefix-input">
                        <span className="prefix">{column.prefix}</span>
                        <input
                          id={key}
                          className="input"
                          type={column.type === 'number' ? 'number' : 'text'}
                          inputMode={column.keyboard ?? (column.type === 'number' ? 'numeric' : undefined)}
                          value={value}
                          onChange={(e) => onChange(key, e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <input
                          id={key}
                          className="input"
                          type={column.type === 'date' || column.type === 'number' ? column.type : 'text'}
                          inputMode={column.keyboard ?? (column.type === 'number' ? 'numeric' : undefined)}
                          list={column.suggestions?.length ? `${key}_list` : undefined}
                          value={value}
                          onChange={(e) => onChange(key, e.target.value)}
                        />
                        {column.suggestions?.length ? (
                          <datalist id={`${key}_list`}>
                            {column.suggestions.map((option) => (
                              <option key={option} value={option} />
                            ))}
                          </datalist>
                        ) : null}
                      </>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {matrix.note && (
        <div className="field-hint" style={{ marginTop: 10 }}>
          {matrix.note}
        </div>
      )}
    </div>
  )
}
