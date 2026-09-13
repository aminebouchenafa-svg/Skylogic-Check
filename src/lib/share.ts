import type { AppSettings } from './storage'

/** Téléchargement direct du PDF (poste de travail). */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function canShareFiles(file: File): boolean {
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean }
  return typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })
}

/**
 * L'appareil sait-il joindre un PDF à un partage ? Sur iPhone / iPad / Android
 * la réponse est oui : c'est le seul chemin qui met réellement le fichier dans
 * WhatsApp ou dans un e-mail. Ni `mailto:` ni `wa.me` ne peuvent porter une
 * pièce jointe, quel que soit le navigateur.
 */
export function supportsFileShare(): boolean {
  return canShareFiles(new File([new Blob([' '])], 'probe.pdf', { type: 'application/pdf' }))
}

export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported' | 'failed'

/**
 * Partage natif (iOS / Android) : ouvre la feuille de partage du téléphone avec
 * le PDF en pièce jointe — WhatsApp, Mail, Gmail, Outlook, AirDrop…
 *
 * Doit être appelé directement dans le gestionnaire du clic : iOS refuse
 * `navigator.share` si un `await` s'est glissé avant. Le PDF est construit de
 * façon synchrone en amont, le geste est donc préservé.
 */
export async function shareFile(file: File, title: string, text: string): Promise<ShareOutcome> {
  if (!canShareFiles(file)) return 'unsupported'
  try {
    await navigator.share({ files: [file], title, text })
    return 'shared'
  } catch (err) {
    if ((err as DOMException)?.name === 'AbortError') return 'cancelled'
    return 'failed'
  }
}

export function mailtoLink(settings: AppSettings, subject: string, body: string): string {
  const to = encodeURIComponent(settings.defaultEmail)
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * Met un numéro au format international attendu par WhatsApp : que des
 * chiffres, indicatif pays compris, sans « + », sans « 00 » et sans le 0
 * national. « 0661 00 00 00 » devient donc « 213661000000 ».
 *
 * Sans cette normalisation WhatsApp répond « ce nom de profil n'existe pas ».
 */
export function normalizePhone(raw: string, countryCode = '213'): string {
  let n = raw.replace(/[^0-9]/g, '')
  if (n.startsWith('00')) n = n.slice(2)
  if (n.startsWith('0')) n = countryCode + n.slice(1)
  return n
}

export function whatsappLink(settings: AppSettings, text: string): string {
  const phone = normalizePhone(settings.defaultWhatsapp)
  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`
}
