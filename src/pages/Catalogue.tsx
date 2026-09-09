import type { FormDef, FormRecord } from '../types/form'
import { CATEGORIES, FORMS } from '../forms'
import { IconPlus } from '../components/Icons'

interface Props {
  records: FormRecord[]
  onOpen: (form: FormDef) => void
}

/** Catalogue des formulaires, regroupés par famille et repérés par leur couleur. */
export function Catalogue({ records, onOpen }: Props) {
  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Formulaires</h1>
          <p className="page-sub">
            Chaque formulaire porte sa couleur, sa référence document et sa révision. Les formulaires
            grisés sont réservés : leur modèle officiel sera intégré au fil de leur transmission.
          </p>
        </div>
      </div>

      {CATEGORIES.map((category) => {
        const forms = FORMS.filter((f) => f.category === category)
        if (forms.length === 0) return null
        return (
          <section key={category} className="stack" style={{ gap: 12 }}>
            <div className="nav-label" style={{ margin: 0 }}>
              {category}
            </div>
            <div className="grid grid-cards">
              {forms.map((form) => {
                const count = records.filter((r) => r.formId === form.id).length
                return (
                  <button
                    key={form.id}
                    className={`panel form-card${form.pending ? ' disabled' : ''}`}
                    style={{ ['--accent' as string]: form.accent }}
                    disabled={form.pending}
                    onClick={() => onOpen(form)}
                  >
                    <div className="form-card-code">{form.code}</div>
                    <div className="form-card-title">{form.title}</div>
                    <div className="form-card-sub">{form.subtitle}</div>
                    <div className="form-card-foot">
                      <span>{form.pending ? 'Modèle à intégrer' : `${count} dossier(s)`}</span>
                      {!form.pending && (
                        <span className="row" style={{ gap: 5, color: form.accent }}>
                          <IconPlus size={14} /> Nouveau
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
