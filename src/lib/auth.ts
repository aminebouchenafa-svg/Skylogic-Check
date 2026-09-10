/**
 * Accès à l'application par un identifiant unique, partagé par l'équipe.
 *
 * ATTENTION — ce n'est pas une protection.
 * L'application est entièrement téléchargée par le navigateur avant que cet
 * écran ne s'affiche : son contenu, et l'empreinte du mot de passe, sont donc
 * lisibles par qui sait les chercher. Le but ici est d'éviter qu'une personne
 * de passage ouvre l'outil, pas de résister à quelqu'un de déterminé.
 * Une vraie fermeture se fait devant le site, pas à l'intérieur.
 */

const KEY = 'skylogic:unlocked:v1'

export const ACCOUNT = {
  user: 'airalgerie',
  /** Empreinte SHA-256 du mot de passe : il n'apparaît pas en clair. */
  passwordHash: '63d0caf15edadbc65a0933d128d1fe7a3b6024b325a3562bf6c7e934040df993',
}

async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function checkCredentials(user: string, password: string): Promise<boolean> {
  if (user.trim().toLowerCase() !== ACCOUNT.user) return false
  try {
    return (await sha256(password)) === ACCOUNT.passwordHash
  } catch {
    // crypto.subtle exige une connexion sécurisée (https ou localhost).
    return false
  }
}

export function isUnlocked(): boolean {
  try {
    return localStorage.getItem(KEY) === '1' || sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** `remember` conserve l'accès entre deux ouvertures de l'application. */
export function unlock(remember: boolean): void {
  try {
    ;(remember ? localStorage : sessionStorage).setItem(KEY, '1')
  } catch {
    /* stockage indisponible : l'accès vaudra pour la session en cours */
  }
}

export function lock(): void {
  try {
    localStorage.removeItem(KEY)
    sessionStorage.removeItem(KEY)
  } catch {
    /* rien à faire */
  }
}
