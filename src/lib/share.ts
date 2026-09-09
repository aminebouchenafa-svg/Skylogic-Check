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
 * Partage natif (iOS / Android) : ouvre la feuille de partage du téléphone avec
 * le PDF en pièce jointe — WhatsApp, Gmail, Outlook, AirDrop…
 * Retourne false si l'appareil ne sait pas partager des fichiers.
 */
export async function shareFile(file: File, title: string, text: string): Promise<boolean> {
  if (!canShareFiles(file)) return false
  try {
    await navigator.share({ files: [file], title, text })
    return true
  } catch (err) {
    if ((err as DOMException)?.name === 'AbortError') return true
    return false
  }
}

export function mailtoLink(settings: AppSettings, subject: string, body: string): string {
  const to = encodeURIComponent(settings.defaultEmail)
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function whatsappLink(settings: AppSettings, text: string): string {
  const phone = settings.defaultWhatsapp.replace(/[^0-9]/g, '')
  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`
}
