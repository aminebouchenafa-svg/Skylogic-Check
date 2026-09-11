import type { FieldDef, FormValues } from '../types/form'
import { Choice } from './Choice'
import { Combobox } from './Combobox'
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
        <Choice
          id={field.id}
          value={text}
          options={field.options ?? []}
          allowOther={field.allowOther}
          ariaLabel={field.label}
          onChange={(value) => onChange(field.id, value)}
        />
      )
      break
    case 'checkbox':
      return (
        <div className={`field field-${field.width ?? 'full'}`}>
          <label className="checkbox">
            <input
              id={field.id}
              type="checkbox"
              checked={Boolean(raw)}
              onChange={(e) => onChange(field.id, e.target.checked)}
            />
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
      // Un préfixe à choisir occupe sa propre valeur : « <champ>_prefix ».
      const prefixId = `${field.id}_prefix`
      // Les propositions peuvent dépendre d'un autre champ (type → immatriculation).
      const depend = field.suggestionsFrom
      const choisi = depend ? String(values[depend.field] ?? '') : ''
      // Un type connu commande la liste, même vide : un appareil non encore
      // réceptionné ne doit pas faire réapparaître toute la flotte.
      const propositions =
        depend && choisi in depend.groups ? depend.groups[choisi] : field.suggestions
      const input = propositions?.length ? (
        <Combobox
          id={field.id}
          value={text}
          options={propositions}
          ariaLabel={field.label}
          placeholder={field.placeholder}
          uppercase={field.uppercase}
          onChange={(value) => onChange(field.id, value)}
        />
      ) : (
        <input
          id={field.id}
          className="input"
          type={field.type === 'number' ? 'number' : field.type}
          inputMode={field.keyboard}
          value={text}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      )

      if (field.prefixOptions?.length) {
        control = (
          <div className="prefix-input">
            <select
              id={prefixId}
              className="prefix prefix-select"
              aria-label={`${field.label} — préfixe`}
              value={String(values[prefixId] ?? '')}
              onChange={(e) => onChange(prefixId, e.target.value)}
            >
              <option value="">—</option>
              {field.prefixOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {input}
          </div>
        )
      } else if (field.prefix) {
        control = (
          <div className="prefix-input">
            <span className="prefix">{field.prefix}</span>
            {input}
          </div>
        )
      } else {
        control = input
      }
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
