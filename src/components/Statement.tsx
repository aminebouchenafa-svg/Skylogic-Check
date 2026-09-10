import type { FormValues, StatementDef } from '../types/form'

interface Props {
  statement: StatementDef
  values: FormValues
  onChange: (id: string, value: string) => void
}

/**
 * Phrase d'attestation : le texte est fixe, les passages entre accolades
 * deviennent des champs à compléter directement dans la phrase.
 */
export function Statement({ statement, values, onChange }: Props) {
  const parts = statement.template.split(/(\{[a-z_]+\})/i)

  return (
    <p className={`statement${statement.framed ? ' framed' : ''}`}>
      {parts.map((part, index) => {
        const match = /^\{([a-z_]+)\}$/i.exec(part)
        if (!match) return <span key={index}>{part}</span>

        const blank = statement.blanks.find((b) => b.id === match[1])
        if (!blank) return <span key={index}>{part}</span>

        return (
          <input
            key={index}
            className="blank"
            style={{ width: `${blank.size ?? 14}ch` }}
            aria-label={blank.label}
            placeholder={blank.label}
            value={String(values[blank.id] ?? '')}
            onChange={(e) => onChange(blank.id, e.target.value)}
          />
        )
      })}
    </p>
  )
}
