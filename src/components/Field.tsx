import type { FieldDef, FormValues } from '../types/form'
import { SignaturePad } from './SignaturePad'

interface Props {
  field: FieldDef
  values: FormValues
  onChange: (id: string, value: string | boolean) => void
}

/** Rend un champ de saisie à partir de sa description déclarative. */
export function Field({ field, values, onChange }: Props) {
  const raw = values[field.id]
  const text = raw === null || raw === undefined ? '' : String(raw)

  const label = (
    <label className="field-label" htmlFor={field.id}>
      {field.label}
      {field.required && <span className="req">*</span>}
    </label>
  )

  let control: React.ReactNode

  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          id={field.id}
          className="textarea"
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      )
      break
    case 'select':
      control = (
        <select id={field.id} className="select" value={text} onChange={(e) => onChange(field.id, e.target.value)}>
          <option value="">— Sélectionner —</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
      break
    case 'checkbox':
      return (
        <div className={`field field-${field.width ?? 'full'}`}>
          <label className="checkbox">
            <input type="checkbox" checked={Boolean(raw)} onChange={(e) => onChange(field.id, e.target.checked)} />
            {field.label}
          </label>
        </div>
      )
    case 'signature':
      return (
        <div className={`field field-${field.width ?? 'half'}`}>
          {label}
          <SignaturePad value={text} onChange={(data) => onChange(field.id, data)} />
        </div>
      )
    default: {
      const input = (
        <input
          id={field.id}
          className="input"
          type={field.type === 'number' ? 'number' : field.type}
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      )
      control = field.prefix ? (
        <div className="prefix-input">
          <span className="prefix">{field.prefix}</span>
          {input}
        </div>
      ) : (
        input
      )
    }
  }

  return (
    <div className={`field field-${field.width ?? 'full'}`}>
      {label}
      {control}
      {field.hint && <span className="field-hint">{field.hint}</span>}
    </div>
  )
}
