import type { FormDef, FormRecord } from '../types/form'
import { FORMS, getForm } from '../forms'
import { SCALE_AH, selectableLevels } from '../forms/scales'
import { RadialHub } from '../components/RadialHub'

interface Props {
  records: FormRecord[]
  onOpenForm: (form: FormDef) => void
  onOpenRecord: (record: FormRecord) => void
  onGoArchive: () => void
}

const monthKey = (iso: string) => iso.slice(0, 7)

export function Home({ records, onOpenForm, onOpenRecord, onGoArchive }: Props) {
  const thisMonth = new Date().toISOString().slice(0, 7)
  const drafts = records.filter((r) => r.status === 'draft')
  const completedThisMonth = records.filter(
    (r) => r.status === 'completed' && monthKey(r.updatedAt) === thisMonth,
  )
  const active = FORMS.filter((f) => !f.pending)
  const recent = records.slice(0, 6)

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Poste de commande</h1>
          <p className="page-sub">
            Choisissez un formulaire sur la roue. Notation au doigt, signatures électroniques,
            export PDF prêt à transmettre par e-mail ou WhatsApp.
          </p>
        </div>
      </div>

      <RadialHub
        forms={FORMS}
        onSelect={onOpenForm}
        centerLabel="Skylogic"
        centerSub={`${active.length} formulaires actifs`}
      />

      <div className="grid grid-kpi">
        <div className="panel kpi">
          <div className="kpi-label">Formulaires actifs</div>
          <div className="kpi-value" style={{ color: 'var(--hud)' }}>
            {active.length}
          </div>
          <div className="kpi-hint">{FORMS.length - active.length} en attente d’intégration</div>
        </div>
        <div className="panel kpi">
          <div className="kpi-label">Brouillons</div>
          <div className="kpi-value" style={{ color: 'var(--gold)' }}>
            {drafts.length}
          </div>
          <div className="kpi-hint">Séances à finaliser</div>
        </div>
        <div className="panel kpi">
          <div className="kpi-label">Terminés ce mois</div>
          <div className="kpi-value" style={{ color: 'var(--grade-4)' }}>
            {completedThisMonth.length}
          </div>
          <div className="kpi-hint">Mois en cours</div>
        </div>
        <div className="panel kpi">
          <div className="kpi-label">Dossiers archivés</div>
          <div className="kpi-value">{records.length}</div>
          <div className="kpi-hint">Total sur cet appareil</div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">Grading</div>
            <div className="panel-sub">Échelle officielle — identique à l’écran et dans le PDF</div>
          </div>
        </div>
        <div className="panel-body">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))' }}>
            {selectableLevels(SCALE_AH).map((level) => (
              <div
                key={level.value}
                style={{
                  borderLeft: `3px solid ${level.color}`,
                  background: 'rgba(6,12,23,0.5)',
                  borderRadius: 9,
                  padding: '12px 14px',
                }}
              >
                <div style={{ color: level.color, fontWeight: 700, fontSize: 20, fontFamily: 'var(--font-display)' }}>
                  {level.short}
                </div>
                <div style={{ fontSize: 13, marginTop: 3 }}>{level.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 6, lineHeight: 1.5 }}>
                  {level.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div className="panel-title">Dossiers récents</div>
          <button className="btn btn-ghost btn-sm" onClick={onGoArchive}>
            Tout voir
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="empty">Aucun dossier pour l’instant. Ouvrez un formulaire pour commencer.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Formulaire</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((record) => {
                const form = getForm(record.formId)
                return (
                  <tr key={record.id} style={{ cursor: 'pointer' }} onClick={() => onOpenRecord(record)}>
                    <td>{record.subject || <span style={{ color: 'var(--text-faint)' }}>Sans nom</span>}</td>
                    <td style={{ color: form?.accent }}>{record.formTitle}</td>
                    <td>{String(record.values.date ?? record.createdAt.slice(0, 10))}</td>
                    <td>
                      <span className={`status-dot status-${record.status}`} />
                      {record.status === 'draft' ? 'Brouillon' : 'Terminé'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
