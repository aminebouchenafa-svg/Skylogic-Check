import { useMemo, useState } from 'react'
import type { FormRecord } from '../types/form'
import { getForm } from '../forms'
import { buildPdfFile, pdfFileName } from '../lib/pdf'
import { downloadBlob } from '../lib/share'
import type { AppSettings } from '../lib/storage'
import { IconPdf, IconTrash } from '../components/Icons'

interface Props {
  records: FormRecord[]
  settings: AppSettings
  onOpen: (record: FormRecord) => void
  onDelete: (id: string) => void
  onToast: (message: string) => void
}

export function Archive({ records, settings, onOpen, onDelete, onToast }: Props) {
  const [query, setQuery] = useState('')
  /** Dossiers cochés en vue d'une suppression groupée. */
  const [choisis, setChoisis] = useState<Set<string>>(new Set())

  const basculer = (id: string) =>
    setChoisis((prev) => {
      const suite = new Set(prev)
      if (suite.has(id)) suite.delete(id)
      else suite.add(id)
      return suite
    })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return records
    return records.filter((r) =>
      [r.subject, r.formTitle, r.formCode, String(r.values.session_ref ?? '')]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [records, query])

  /** Sélection limitée aux dossiers visibles : filtrer puis tout cocher. */
  const visiblesChoisis = filtered.filter((r) => choisis.has(r.id))
  const toutCoche = filtered.length > 0 && visiblesChoisis.length === filtered.length

  const basculerTout = () =>
    setChoisis((prev) => {
      const suite = new Set(prev)
      if (toutCoche) filtered.forEach((r) => suite.delete(r.id))
      else filtered.forEach((r) => suite.add(r.id))
      return suite
    })

  const supprimerLot = () => {
    const nombre = visiblesChoisis.length
    if (!nombre) return
    const message =
      nombre === 1
        ? 'Supprimer définitivement ce dossier ?'
        : `Supprimer définitivement ces ${nombre} dossiers ?`
    if (!confirm(message)) return
    visiblesChoisis.forEach((r) => onDelete(r.id))
    setChoisis(new Set())
    onToast(nombre === 1 ? 'Dossier supprimé' : `${nombre} dossiers supprimés`)
  }

  const exportPdf = (record: FormRecord) => {
    const form = getForm(record.formId)
    if (!form) return
    const file = buildPdfFile(form, record, settings)
    downloadBlob(file, pdfFileName(form, record))
    onToast(`PDF généré : ${file.name}`)
  }

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-sub">
            Tous les dossiers enregistrés sur cet appareil. Le PDF peut être régénéré à tout moment,
            à l’identique.
          </p>
        </div>
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Rechercher un candidat, un vol…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {visiblesChoisis.length > 0 && (
        <div className="panel select-bar">
          <span>
            <strong>{visiblesChoisis.length}</strong>{' '}
            {visiblesChoisis.length === 1 ? 'dossier sélectionné' : 'dossiers sélectionnés'}
          </span>
          <span className="spacer" />
          <button className="btn btn-ghost btn-sm" onClick={() => setChoisis(new Set())}>
            Tout décocher
          </button>
          <button className="btn btn-primary btn-sm" onClick={supprimerLot}>
            <IconTrash size={15} /> Supprimer
          </button>
        </div>
      )}

      <section className="panel">
        {filtered.length === 0 ? (
          <div className="empty">Aucun dossier ne correspond.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    className="matrix-tick"
                    aria-label="Tout sélectionner"
                    checked={toutCoche}
                    onChange={basculerTout}
                  />
                </th>
                <th>Candidat</th>
                <th>Formulaire</th>
                <th>Date</th>
                <th>Statut</th>
                <th style={{ width: 130 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const form = getForm(record.formId)
                return (
                  <tr key={record.id} className={choisis.has(record.id) ? 'row-on' : undefined}>
                    <td>
                      <input
                        type="checkbox"
                        className="matrix-tick"
                        aria-label={`Sélectionner ${record.subject || 'ce dossier'}`}
                        checked={choisis.has(record.id)}
                        onChange={() => basculer(record.id)}
                      />
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={() => onOpen(record)}>
                      {record.subject || <span style={{ color: 'var(--text-faint)' }}>Sans nom</span>}
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={() => onOpen(record)}>
                      <span style={{ color: form?.accent }}>{record.formCode}</span> · {record.formTitle}
                    </td>
                    <td>{String(record.values.date ?? record.createdAt.slice(0, 10))}</td>
                    <td>
                      <span className={`status-dot status-${record.status}`} />
                      {record.status === 'draft' ? 'Brouillon' : 'Terminé'}
                    </td>
                    <td>
                      <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" title="Exporter en PDF" onClick={() => exportPdf(record)}>
                          <IconPdf size={15} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Supprimer"
                          onClick={() => {
                            if (confirm('Supprimer définitivement ce dossier ?')) onDelete(record.id)
                          }}
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
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
