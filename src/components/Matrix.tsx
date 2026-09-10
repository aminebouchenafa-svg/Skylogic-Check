import type { FormValues, MatrixDef } from '../types/form'
import { cellId } from '../lib/ids'
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
                          value={value}
                          onChange={(e) => onChange(key, e.target.value)}
                        />
                      </div>
                    ) : (
                      <input
                        id={key}
                        className="input"
                        type={column.type === 'date' || column.type === 'number' ? column.type : 'text'}
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                      />
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
