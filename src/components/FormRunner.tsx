import { useMemo, useState } from 'react'
import type { FormDef, FormRecord, FormValues, SectionDef } from '../types/form'
import { findLevel, getScale, selectableLevels } from '../forms/scales'
import { buildPdfFile } from '../lib/pdf'
import { downloadBlob, canShareFiles, mailtoLink, shareFile, whatsappLink } from '../lib/share'
import { gradeId } from '../lib/ids'
import { upsertRecord } from '../lib/storage'
import type { AppSettings } from '../lib/storage'
import { Answers } from './Answers'
import { Checklist } from './Checklist'
import { Field } from './Field'
import { GradeRow } from './GradeRow'
import { Matrix } from './Matrix'
import { Statement } from './Statement'
import { IconAlert, IconBack, IconMail, IconPdf, IconSave, IconShare, IconWhatsapp } from './Icons'

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
  /** Colonne de notation en cours de saisie, pour les grilles à plusieurs colonnes. */
  const [column, setColumn] = useState(
    form.sections.find((s) => s.gradeColumns)?.gradeColumns?.[0].id ?? '',
  )

  const setValue = (id: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [id]: value }))

  const gradedItems = useMemo(
    () =>
      form.sections
        .filter((s) => s.kind === 'grading')
        .flatMap((s) =>
          (s.items ?? [])
            .filter((item) => !item.heading && item.input !== 'date' && item.input !== 'text')
            .flatMap((item) =>
              (s.gradeColumns ?? [{ id: '' }]).map((col) => ({
                key: col.id ? gradeId(item.id, col.id) : item.id,
                item,
                scaleId: s.scaleId ?? form.scaleId,
              })),
            ),
        ),
    [form],
  )

  const summary = useMemo(() => {
    let scored = 0
    let total = 0
    const failing: string[] = []
    for (const { key, item, scaleId } of gradedItems) {
      const raw = values[key]
      if (raw === undefined || raw === null || raw === '' || raw === 'NA') continue
      const level = findLevel(getScale(scaleId), String(raw))
      if (!level) continue
      scored += 1
      total += Number(level.value)
      if (level.failing) failing.push(item.label)
    }
    return { scored, count: gradedItems.length, average: scored ? total / scored : null, failing }
  }, [gradedItems, values])

  const missing = useMemo(() => {
    const required = form.sections.flatMap((s) => (s.fields ?? []).filter((f) => f.required))
    return required.filter((f) => {
      const value = values[f.id]
      return value === undefined || value === null || value === ''
    })
  }, [form, values])

  const remarksMissing =
    summary.failing.length > 0 && !String(values.remarks ?? '').trim() &&
    form.sections.some((s) => s.id === 'remarks')

  const isGraded = form.sections.some((s) => s.kind === 'grading')
  const subject = String(values.name ?? '').trim()

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
    if (missing.length > 0 || remarksMissing) {
      setShowErrors(true)
      onToast(remarksMissing && missing.length === 0
        ? 'Remarque obligatoire pour les items notés 1 ou 2'
        : `${missing.length} champ(s) obligatoire(s) à renseigner`)
      return
    }
    persist('completed')
    onToast('Formulaire marqué comme terminé')
  }

  const makeFile = () => buildPdfFile(form, persist(status), settings)

  const exportPdf = () => {
    const file = makeFile()
    downloadBlob(file, file.name)
    onToast(`PDF généré : ${file.name}`)
  }

  const message = () =>
    `${form.title} — ${subject || 'candidat'} — ${String(values.date ?? '')}\n` +
    `${settings.operator} · ${settings.department}\n${form.code}`

  const share = async () => {
    const file = makeFile()
    if (await shareFile(file, form.title, message())) return
    downloadBlob(file, file.name)
    onToast('Partage natif indisponible : le PDF a été téléchargé, joignez-le à votre message')
  }

  const sendMail = () => {
    const file = makeFile()
    downloadBlob(file, file.name)
    window.location.href = mailtoLink(settings, `${form.title} — ${subject || 'Rapport'}`, message())
  }

  const sendWhatsapp = () => {
    const file = makeFile()
    downloadBlob(file, file.name)
    window.open(whatsappLink(settings, message()), '_blank', 'noopener')
  }

  const renderSection = (section: SectionDef) => {
    if (section.kind === 'divider') {
      return (
        <div className="divider" key={section.id}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
          </svg>
          {section.title}
        </div>
      )
    }

    const scale = getScale(section.scaleId ?? form.scaleId)
    const graded = (section.items ?? []).filter((i) => i.input !== 'date')

    return (
      <section key={section.id} className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{section.title}</div>
            {section.subtitle && <div className="panel-sub">{section.subtitle}</div>}
          </div>
          {section.kind === 'grading' && graded.length > 1 && (
            <span className="chip">
              {graded.filter((i) => values[i.id]).length}/{graded.length}
            </span>
          )}
        </div>

        {section.kind === 'grading' && (
          <>
            {section.gradeColumns && (
              <div className="column-tabs">
                <span className="column-tabs-label">Secteur</span>
                {section.gradeColumns.map((col) => {
                  const notes = (section.items ?? []).filter(
                    (i) => !i.heading && values[gradeId(i.id, col.id)],
                  ).length
                  return (
                    <button
                      key={col.id}
                      type="button"
                      className={`column-tab${column === col.id ? ' on' : ''}`}
                      onClick={() => setColumn(col.id)}
                    >
                      {col.label}
                      {notes > 0 && <span className="column-tab-count">{notes}</span>}
                    </button>
                  )
                })}
              </div>
            )}
            <div>
              {(section.items ?? []).map((item) => {
                if (item.heading) {
                  return (
                    <div className="tick-heading" key={item.id}>
                      {item.label}
                    </div>
                  )
                }
                const key = section.gradeColumns ? gradeId(item.id, column) : item.id
                return (
                  <GradeRow
                    key={item.id}
                    item={item}
                    scale={scale}
                    value={String(values[key] ?? '')}
                    onChange={(value) => setValue(key, value)}
                  />
                )
              })}
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
        )}

        {section.kind === 'checklist' && (
          <>
            <Checklist
              items={section.items ?? []}
              columns={section.tickColumns ?? []}
              values={values}
              onChange={setValue}
              exclusive={section.exclusiveTicks}
              trailing={section.trailingColumns}
            />
            {section.note && (
              <div className="panel-body" style={{ borderTop: '1px solid var(--stroke)' }}>
                <div className="field-hint">{section.note}</div>
              </div>
            )}
          </>
        )}

        {section.kind === 'endorsement' && (
          <div className="panel-body">
            {section.note && <p className="endorse-note">{section.note}</p>}
            {(section.fields ?? [])
              .filter((f) => f.type === 'textarea')
              .map((field) => (
                <Field key={field.id} field={field} values={values} onChange={setValue} />
              ))}
            <div className="endorse-strip">
              {(section.fields ?? [])
                .filter((f) => f.type !== 'textarea')
                .map((field) => (
                  <Field key={field.id} field={{ ...field, width: 'full' }} values={values} onChange={setValue} />
                ))}
            </div>
          </div>
        )}

        {section.kind === 'reference' && (
          <div className="reference">
            {(section.referenceRows ?? []).map((row) => (
              <div className="reference-row" key={row.label}>
                <span
                  className="reference-badge"
                  style={{ ['--dot' as string]: row.color ?? 'var(--text-faint)' }}
                >
                  {row.label}
                </span>
                <span className="reference-text">{row.description}</span>
              </div>
            ))}
          </div>
        )}

        {section.kind === 'statement' && section.statement && (
          <div className="panel-body">
            <Statement statement={section.statement} values={values} onChange={setValue} />
          </div>
        )}

        {section.kind === 'matrix' && section.matrix && (
          <div className="panel-body">
            <Matrix id={section.id} matrix={section.matrix} values={values} onChange={setValue} />
          </div>
        )}

        {section.kind === 'answers' && (
          <div className="panel-body">
            <Answers
              sectionId={section.id}
              count={section.answerCount ?? 10}
              values={values}
              onChange={setValue}
            />
          </div>
        )}

        {section.kind === 'result' && section.choiceRows && (
          <div>
            {section.choiceRows.map((row) => (
              <div className="choice-row" key={row.id}>
                <div>
                  <div className="choice-row-label">{row.label}</div>
                  {row.hint && <div className="choice-row-hint">{row.hint}</div>}
                </div>
                <div className="choice-row-buttons">
                  {row.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`choice-btn${values[row.id] === option.value ? ' on' : ''}`}
                      style={{ ['--choice' as string]: option.color }}
                      onClick={() =>
                        setValue(row.id, values[row.id] === option.value ? '' : option.value)
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {section.kind === 'result' && !section.choiceRows && (
          <div className="panel-body">
            <div className="result-choice">
              {(section.choices ?? []).map((choice) => (
                <button
                  key={choice.value}
                  type="button"
                  className={`result-btn${values.result === choice.value ? ' on' : ''}`}
                  style={{ ['--choice' as string]: choice.color }}
                  onClick={() => setValue('result', choice.value)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {(section.kind === 'identification' || section.kind === 'notes' || section.kind === 'signature') && (
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

  /** Les sections d'un même « spread » sont présentées côte à côte, comme sur le papier. */
  const blocks: React.ReactNode[] = []
  for (let i = 0; i < form.sections.length; i += 1) {
    const section = form.sections[i]
    if (!section.spread) {
      blocks.push(renderSection(section))
      continue
    }
    const spread = section.spread
    const group: SectionDef[] = []
    while (i < form.sections.length && form.sections[i].spread === spread) {
      group.push(form.sections[i])
      i += 1
    }
    i -= 1
    blocks.push(
      <div className="spread" key={`spread-${spread}`}>
        <div className="stack">{group.filter((s) => s.column !== 'right').map(renderSection)}</div>
        <div className="stack">{group.filter((s) => s.column === 'right').map(renderSection)}</div>
      </div>,
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
              {form.category}
            </span>
            <span className="chip">{form.revision}</span>
            <span className="chip">
              <span className={`status-dot status-${status}`} />
              {status === 'draft' ? 'Brouillon' : 'Terminé'}
            </span>
          </div>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            {form.title}
          </h1>
          <p className="page-sub">{form.subtitle}</p>
        </div>

        {isGraded && (
          <div className="panel kpi" style={{ minWidth: 200 }}>
            <div className="kpi-label">Moyenne</div>
            <div className="kpi-value" style={{ color: form.accent }}>
              {summary.average ? summary.average.toFixed(2) : '—'}
            </div>
            <div className="kpi-hint">
              {summary.scored} item(s) noté(s) sur {summary.count}
            </div>
          </div>
        )}
      </div>

      {summary.failing.length > 0 && (
        <div className="alert">
          <IconAlert size={17} />
          <div>
            <strong>{summary.failing.length} item(s) noté(s) 1 ou 2.</strong> La rubrique Remarks est
            obligatoire : {summary.failing.slice(0, 3).join(' · ')}
            {summary.failing.length > 3 && ' …'}
          </div>
        </div>
      )}

      {showErrors && (missing.length > 0 || remarksMissing) && (
        <div className="alert">
          <IconAlert size={17} />
          <div>
            {missing.length > 0 && <>Champs obligatoires : {missing.map((f) => f.label).join(', ')}. </>}
            {remarksMissing && <>La rubrique Remarks doit être renseignée.</>}
          </div>
        </div>
      )}

      {isGraded && (
        <div className="panel legend-bar">
          {selectableLevels(getScale(form.scaleId)).map((level) => (
            <span className="legend-item" key={level.value}>
              <span className="legend-badge" style={{ ['--dot' as string]: level.color }}>
                {level.short}
              </span>
              {level.label}
            </span>
          ))}
        </div>
      )}

      {blocks}

      {form.reminder && (
        <div className="reminder">
          <strong>Reminder : </strong>
          {form.reminder}
        </div>
      )}

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
          <IconShare size={16} /> {shareLabel()}
        </button>
      </div>
    </div>
  )
}

/** Sur mobile le partage joint directement le PDF ; sur poste fixe il est téléchargé. */
function shareLabel(): string {
  const probe = new File([new Blob()], 'probe.pdf', { type: 'application/pdf' })
  return canShareFiles(probe) ? 'Partager le PDF' : 'Envoyer'
}
