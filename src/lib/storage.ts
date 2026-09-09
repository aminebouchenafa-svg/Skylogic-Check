import type { FormRecord, FormValues } from '../types/form'

const RECORDS_KEY = 'skylogic:records:v1'
const SETTINGS_KEY = 'skylogic:settings:v1'

export interface AppSettings {
  operator: string
  department: string
  managerName: string
  /** Adresse de destination par défaut des rapports PDF. */
  defaultEmail: string
  /** Numéro WhatsApp par défaut, format international sans « + ». */
  defaultWhatsapp: string
  /** Logo de la compagnie (image en data URL), imprimé en tête du PDF. */
  logo: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  operator: 'Air Algérie',
  department: 'Fleet Training Department',
  managerName: '',
  defaultEmail: '',
  defaultWhatsapp: '',
  logo: '',
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback
  } catch {
    return fallback
  }
}

export function loadSettings(): AppSettings {
  return read(SETTINGS_KEY, DEFAULT_SETTINGS)
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadRecords(): FormRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    const list = raw ? (JSON.parse(raw) as FormRecord[]) : []
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}

function persist(records: FormRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function getRecord(id: string): FormRecord | undefined {
  return loadRecords().find((r) => r.id === id)
}

export function upsertRecord(record: FormRecord): FormRecord {
  const records = loadRecords().filter((r) => r.id !== record.id)
  const next = { ...record, updatedAt: new Date().toISOString() }
  persist([next, ...records])
  return next
}

export function deleteRecord(id: string): void {
  persist(loadRecords().filter((r) => r.id !== id))
}

export function newRecord(
  formId: string,
  formCode: string,
  formTitle: string,
  values: FormValues = {},
): FormRecord {
  const now = new Date().toISOString()
  return {
    id: `${formId}-${now.slice(0, 10)}-${Math.random().toString(36).slice(2, 7)}`,
    formId,
    formCode,
    formTitle,
    subject: '',
    status: 'draft',
    values,
    createdAt: now,
    updatedAt: now,
  }
}
