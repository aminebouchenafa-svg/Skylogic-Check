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

      <section className="panel">
        {filtered.length === 0 ? (
          <div className="empty">Aucun dossier ne correspond.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
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
                  <tr key={record.id}>
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
