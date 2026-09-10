import { useState } from 'react'
import { checkCredentials, unlock } from '../lib/auth'
import { Wordmark } from './Wordmark'

interface Props {
  onUnlock: () => void
}

/** Écran d'entrée : un identifiant unique, partagé par l'équipe. */
export function Lock({ onUnlock }: Props) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    if (await checkCredentials(user, password)) {
      unlock(remember)
      onUnlock()
      return
    }
    setBusy(false)
    setPassword('')
    setError('Identifiant ou mot de passe incorrect.')
  }

  return (
    <div className="lock">
      <form className="panel lock-card" onSubmit={submit}>
        <Wordmark />

        <p className="lock-intro">
          Accès réservé au Fleet Training Department. Identifiant commun à l’équipe.
        </p>

        <div className="field">
          <label className="field-label" htmlFor="lock-user">
            Identifiant
          </label>
          <input
            id="lock-user"
            className="input"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="lock-password">
            Mot de passe
          </label>
          <input
            id="lock-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className="checkbox">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Rester connecté sur cet appareil
        </label>

        {error && <div className="alert">{error}</div>}

        <button className="btn btn-primary" type="submit" disabled={busy || !user || !password}>
          {busy ? 'Vérification…' : 'Entrer'}
        </button>
      </form>
    </div>
  )
}
