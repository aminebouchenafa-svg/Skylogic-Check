import { useEffect, useState } from 'react'
import type { FormDef, FormRecord } from './types/form'
import { getForm } from './forms'
import { FormRunner } from './components/FormRunner'
import { Lock } from './components/Lock'
import { Archive } from './pages/Archive'
import { Home } from './pages/Home'
import { Settings } from './pages/Settings'
import { IconArchive, IconBack, IconGauge, IconMoon, IconSettings, IconSun } from './components/Icons'
import { isUnlocked, lock } from './lib/auth'
import { applyTheme, loadTheme } from './lib/theme'
import {
  deleteRecord,
  loadRecords,
  loadSettings,
  newRecord,
  saveSettings,
  upsertRecord,
} from './lib/storage'

type View = 'home' | 'archive' | 'settings' | 'runner'

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Poste de commande', icon: <IconGauge /> },
  { id: 'archive', label: 'Archive', icon: <IconArchive /> },
  { id: 'settings', label: 'Réglages', icon: <IconSettings /> },
]

export default function App() {
  const [unlocked, setUnlocked] = useState(() => isUnlocked())
  const [view, setView] = useState<View>('home')
  // Lecture directe du stockage local : l'application est entièrement côté client.
  const [records, setRecords] = useState<FormRecord[]>(() => loadRecords())
  const [settings, setSettings] = useState(() => loadSettings())
  const [current, setCurrent] = useState<{ form: FormDef; record: FormRecord } | null>(null)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState(() => loadTheme())

  const switchTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const refresh = () => setRecords(loadRecords())

  const openNew = (form: FormDef) => {
    const record = newRecord(form.id, form.code, form.title, {
      date: new Date().toISOString().slice(0, 10),
    })
    upsertRecord(record)
    refresh()
    setCurrent({ form, record })
    setView('runner')
  }

  const openExisting = (record: FormRecord) => {
    const form = getForm(record.formId)
    if (!form) {
      setToast('Ce formulaire n’est plus disponible dans le catalogue')
      return
    }
    setCurrent({ form, record })
    setView('runner')
  }

  const exitRunner = () => {
    setCurrent(null)
    refresh()
    setView('archive')
  }

  const navigate = (next: View) => {
    setCurrent(null)
    refresh()
    setView(next)
  }

  if (!unlocked) return <Lock onUnlock={() => setUnlocked(true)} />

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}emblem.png`} alt="" />
          <div>
            <div className="brand-name">
              <span className="wm-sky">SKY</span>
              <span className="wm-logic">LOGIC</span>
            </div>
            <div className="brand-sub">Check · Fleet Training</div>
          </div>
        </div>

        <nav className="nav">
          <div className="nav-label">Navigation</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-item${view === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">
          <button
            className="btn btn-ghost btn-sm theme-toggle"
            onClick={switchTheme}
            aria-label={theme === 'dark' ? 'Passer en mode jour' : 'Passer en mode nuit'}
          >
            {theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
            {theme === 'dark' ? 'Mode jour' : 'Mode nuit'}
          </button>
          <br />
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 12 }}
            onClick={() => {
              lock()
              setUnlocked(false)
            }}
          >
            <IconBack size={14} /> Se déconnecter
          </button>
          <br />
          {settings.operator}
          <br />
          {settings.department}
          <br />
          <span style={{ opacity: 0.6 }}>Données stockées sur cet appareil</span>
        </div>
      </aside>

      <main className="main">
        {view === 'home' && (
          <Home
            records={records}
            onOpenForm={openNew}
            onOpenRecord={openExisting}
            onGoArchive={() => navigate('archive')}
          />
        )}
        {view === 'archive' && (
          <Archive
            records={records}
            settings={settings}
            onOpen={openExisting}
            onDelete={(id) => {
              deleteRecord(id)
              refresh()
              setToast('Dossier supprimé')
            }}
            onToast={setToast}
          />
        )}
        {view === 'settings' && (
          <Settings
            settings={settings}
            onSave={(next) => {
              saveSettings(next)
              setSettings(next)
              setToast('Réglages enregistrés')
            }}
          />
        )}
        {view === 'runner' && current && (
          <FormRunner
            key={current.record.id}
            form={current.form}
            record={current.record}
            settings={settings}
            onExit={exitRunner}
            onToast={setToast}
          />
        )}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
