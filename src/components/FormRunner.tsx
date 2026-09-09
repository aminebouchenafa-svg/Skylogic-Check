import { useMemo, useState } from 'react'
import type { FormDef, FormRecord, FormValues, SectionDef } from '../types/form'
import { getScale } from '../forms/scales'
import { buildPdfFile } from '../lib/pdf'
import { downloadBlob, canShareFiles, mailtoLink, shareFile, whatsappLink } from '../lib/share'
import { upsertRecord } from '../lib/storage'
import type { AppSettings } from '../lib/storage'
import { Field } from './Field'
import { GradeRow } from './GradeRow'
import {
  IconAlert,
  IconBack,
  IconMail,
  IconPdf,
  IconSave,
  IconShare,
  IconWhatsapp,
} from './Icons'

interface Props {
  form: FormDef
  record: FormRecord
  settings: AppSettings
  onExit: () => void
  onToast: (message: string) => void
}

/** Moteur de saisie : construit l'écran complet à partir de la définition du formulaire. */
export function FormRunner({ form, record, settings, onExit, onToast }: Props) {
  const [values, setValues] = useState<FormValues>(record.values)
  const [status, setStatus] = useState(record.status)
  const [showErrors, setShowErrors] = useState(false)

  const setValue = (id: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [id]: value }))

  const gradedItems = useMemo(
    () =>
      form.sections
        .filter((s) => s.kind === 'grading')
        .flatMap((s) => (s.items ?? []).map((item) => ({ item, scaleId: s.scaleId ?? form.scaleId }))),
    [form],
  )

  const summary = useMemo(() => {
    let scored = 0
    let total = 0
    const failing: string[] = []
    for (const { item, scaleId } of gradedItems) {
      const value = values[item.id]
      if (value === undefined || value === null || value === '' || value === 'NA') continue
      const level = getScale(scaleId).levels.find((l) => l.value === String(value))
      if (!level) continue
      scored += 1
      const numeric = Number(level.value)
      if (!Number.isNaN(numeric)) total += numeric
      if (level.failing) failing.push(`${item.code ? `${item.code} — ` : ''}${item.label}`)
    }
    return {
      scored,
      count: gradedItems.length,
      average: scored > 0 && total > 0 ? total / scored : null,
      failing,
    }
  }, [gradedItems, values])

  const missing = useMemo(() => {
    const required = form.sections.flatMap((s) => (s.fields ?? []).filter((f) => f.required))
    return required.filter((f) => {
      const value = values[f.id]
      return value === undefined || value === null || value === ''
    })
  }, [form, values])

  const subject = String(values.trainee_name ?? '').trim()

  const persist = (nextStatus: FormRecord['status']) => {
    const saved = upsertRecord({ ...record, values, status: nextStatus, subject })
    setStatus(nextStatus)
    return saved
  }

  const save = () => {
    persist(status)
    onToast('Brouillon enregistré sur cet appareil')
  }

  const complete = () => {
    if (missing.length > 0) {
      setShowErrors(true)
      onToast(`${missing.length} champ(s) obligatoire(s) à renseigner`)
      return
    }
    persist('completed')
    onToast('Formulaire marqué comme terminé')
  }

  const makeFile = () => {
    const saved = persist(status)
    return buildPdfFile(form, saved, settings)
  }

  const exportPdf = () => {
    const file = makeFile()
    downloadBlob(file, file.name)
    onToast(`PDF généré : ${file.name}`)
  }

  const message = () =>
    `${form.title} — ${subject || 'candidat'} — ${String(values.date ?? '')}\n` +
    `${settings.operator} · ${settings.department}\nRéférence ${form.code}`

  const share = async () => {
    const file = makeFile()
    if (await shareFile(file, form.title, message())) return
    downloadBlob(file, file.name)
    onToast('Partage natif indisponible : le PDF a été téléchargé, joignez-le à votre message')
  }

  const sendMail = () => {
    const file = makeFile()
    downloadBlob(file, file.name)
    window.location.href = mailtoLink(settings, `${form.code} — ${subject || 'Rapport'}`, message())
  }

  const sendWhatsapp = () => {
    const file = makeFile()
    downloadBlob(file, file.name)
    window.open(whatsappLink(settings, message()), '_blank', 'noopener')
  }

  const renderSection = (section: SectionDef) => {
    const scale = getScale(section.scaleId ?? form.scaleId)
    return (
      <section key={section.id} className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{section.title}</div>
            {section.subtitle && <div className="panel-sub">{section.subtitle}</div>}
          </div>
          {section.kind === 'grading' && (
            <span className="chip">
              {(section.items ?? []).filter((i) => values[i.id]).length}/{(section.items ?? []).length} noté
            </span>
          )}
        </div>

        {section.kind === 'grading' ? (
          <>
            <div>
              {(section.items ?? []).map((item) => (
                <GradeRow
                  key={item.id}
                  item={item}
                  scale={scale}
                  value={String(values[item.id] ?? '')}
                  onChange={(value) => setValue(item.id, value)}
                />
              ))}
            </div>
            <div className="legend">
              {scale.levels.map((level) => (
                <span className="legend-item" key={level.value}>
                  <span className="legend-dot" style={{ ['--dot' as string]: level.color }} />
                  {level.short} · {level.label}
                </span>
              ))}
            </div>
            {section.commentField && (
              <div className="panel-body" style={{ borderTop: '1px solid var(--stroke)' }}>
                <Field
                  field={{
                    id: section.commentField.id,
                    label: section.commentField.label,
                    type: 'textarea',
                    width: 'full',
                    placeholder: section.commentField.placeholder,
                  }}
                  values={values}
                  onChange={setValue}
                />
              </div>
            )}
          </>
        ) : (
          <div className="panel-body">
            <div className="field-grid">
              {(section.fields ?? []).map((field) => (
                <Field key={field.id} field={field} values={values} onChange={setValue} />
              ))}
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={onExit} style={{ marginBottom: 12 }}>
            <IconBack size={15} /> Retour
          </button>
          <div className="row">
            <span className="chip solid" style={{ ['--accent' as string]: form.accent }}>
              {form.code}
            </span>
            <span className="chip">{form.category}</span>
            <span className="chip">
              <span className={`status-dot status-${status}`} />
              {status === 'draft' ? 'Brouillon' : 'Terminé'}
            </span>
          </div>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            {form.title}
          </h1>
          <p className="page-sub">
            {form.subtitle} · {form.revision}
          </p>
        </div>

        <div className="panel kpi" style={{ minWidth: 200 }}>
          <div className="kpi-label">Moyenne</div>
          <div className="kpi-value" style={{ color: form.accent }}>
            {summary.average ? summary.average.toFixed(2) : '—'}
          </div>
          <div className="kpi-hint">
            {summary.scored} item(s) noté(s) sur {summary.count}
          </div>
        </div>
      </div>

      {summary.failing.length > 0 && (
        <div className="alert">
          <IconAlert size={17} />
          <div>
            <strong>{summary.failing.length} item(s) sous le standard.</strong> Une action de remédiation
            doit être renseignée dans la synthèse : {summary.failing.slice(0, 3).join(' · ')}
            {summary.failing.length > 3 && ' …'}
          </div>
        </div>
      )}

      {showErrors && missing.length > 0 && (
        <div className="alert">
          <IconAlert size={17} />
          <div>
            Champs obligatoires manquants : {missing.map((f) => f.label).join(', ')}
          </div>
        </div>
      )}

      {form.sections.map(renderSection)}

      <div className="actionbar">
        <button className="btn" onClick={save}>
          <IconSave size={16} /> Enregistrer
        </button>
        <button className="btn btn-hud" onClick={complete}>
          Marquer terminé
        </button>
        <span className="spacer" />
        <button className="btn" onClick={exportPdf}>
          <IconPdf size={16} /> PDF
        </button>
        <button className="btn" onClick={sendMail} title={settings.defaultEmail || 'Adresse à définir dans les réglages'}>
          <IconMail size={16} /> E-mail
        </button>
        <button className="btn" onClick={sendWhatsapp}>
          <IconWhatsapp size={16} /> WhatsApp
        </button>
        <button className="btn btn-primary" onClick={share}>
          <IconShare size={16} /> {canShareFilesHint()}
        </button>
      </div>
    </div>
  )
}

/** Sur mobile le partage joint directement le PDF ; sur poste fixe il est téléchargé. */
function canShareFilesHint(): string {
  const probe = new File([new Blob()], 'probe.pdf', { type: 'application/pdf' })
  return canShareFiles(probe) ? 'Partager le PDF' : 'Envoyer'
}
