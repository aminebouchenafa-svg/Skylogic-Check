import { useState } from 'react'
import type { AppSettings } from '../lib/storage'
import { IconSave } from '../components/Icons'

interface Props {
  settings: AppSettings
  onSave: (settings: AppSettings) => void
}

export function Settings({ settings, onSave }: Props) {
  const [draft, setDraft] = useState(settings)
  const set = (key: keyof AppSettings, value: string) => setDraft({ ...draft, [key]: value })

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="page-title">Réglages</h1>
          <p className="page-sub">
            Ces informations apparaissent en en-tête et en pied de chaque PDF, et pré-remplissent la
            destination des envois.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div className="panel-title">Entité</div>
        </div>
        <div className="panel-body">
          <div className="field-grid">
            <div className="field field-half">
              <label className="field-label" htmlFor="operator">Compagnie</label>
              <input id="operator" className="input" value={draft.operator} onChange={(e) => set('operator', e.target.value)} />
            </div>
            <div className="field field-half">
              <label className="field-label" htmlFor="department">Département</label>
              <input id="department" className="input" value={draft.department} onChange={(e) => set('department', e.target.value)} />
            </div>
            <div className="field field-half">
              <label className="field-label" htmlFor="manager">Responsable</label>
              <input id="manager" className="input" value={draft.managerName} onChange={(e) => set('managerName', e.target.value)} placeholder="Fleet Training Manager" />
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">Destinataires par défaut</div>
            <div className="panel-sub">Utilisés par les boutons E-mail et WhatsApp des formulaires</div>
          </div>
        </div>
        <div className="panel-body">
          <div className="field-grid">
            <div className="field field-half">
              <label className="field-label" htmlFor="email">Adresse e-mail de destination</label>
              <input id="email" className="input" type="email" value={draft.defaultEmail} onChange={(e) => set('defaultEmail', e.target.value)} placeholder="training.records@exemple.dz" />
              <span className="field-hint">
                Le PDF est téléchargé puis à joindre au message ; sur téléphone, le bouton « Partager »
                le joint directement.
              </span>
            </div>
            <div className="field field-half">
              <label className="field-label" htmlFor="whatsapp">Numéro WhatsApp</label>
              <input id="whatsapp" className="input" value={draft.defaultWhatsapp} onChange={(e) => set('defaultWhatsapp', e.target.value)} placeholder="213661000000" />
              <span className="field-hint">Format international, sans « + » ni espaces.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="actionbar">
        <span className="spacer" />
        <button className="btn btn-primary" onClick={() => onSave(draft)}>
          <IconSave size={16} /> Enregistrer les réglages
        </button>
      </div>
    </div>
  )
}
