import type { FormValues } from '../types/form'
import { answerId } from '../lib/ids'

interface Props {
  sectionId: string
  count: number
  values: FormValues
  onChange: (id: string, value: string) => void
}

/** Grille de réponses numérotées : une case par question. */
export function Answers({ sectionId, count, values, onChange }: Props) {
  return (
    <div className="answers">
      {Array.from({ length: count }, (_, i) => {
        const key = answerId(sectionId, i + 1)
        return (
          <label className="answer" key={key}>
            <span className="answer-num">{i + 1}</span>
            <input
              id={key}
              className="input answer-input"
              value={String(values[key] ?? '')}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </label>
        )
      })}
    </div>
  )
}
