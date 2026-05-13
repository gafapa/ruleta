import type { SavedWheel } from '../types'
import {
  MAX_ITEM_LABEL_LENGTH,
  MAX_SAVED_WHEELS,
  MAX_WHEEL_ITEMS,
  MAX_WHEEL_NAME_LENGTH,
} from './limits'

const KEY = 'ruleta_wheels'
const STORAGE_VERSION = 1
const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i

interface StoredWheelsPayload {
  version: number
  wheels: SavedWheel[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeWheel(value: unknown): SavedWheel | null {
  if (!isRecord(value)) return null
  const rawItems = Array.isArray(value.items) ? value.items : []
  const items = rawItems
    .map((item) => {
      if (!isRecord(item) || typeof item.label !== 'string' || typeof item.color !== 'string') {
        return null
      }
      return {
        id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
        label: item.label.trim().slice(0, MAX_ITEM_LABEL_LENGTH),
        color: HEX_COLOR_RE.test(item.color) ? item.color : '#7C3AED',
      }
    })
    .filter((item): item is SavedWheel['items'][number] => item !== null && item.label.length > 0)
    .slice(0, MAX_WHEEL_ITEMS)

  if (items.length < 2 || typeof value.name !== 'string') return null
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt
    : Date.now()

  return {
    id: typeof value.id === 'string' && value.id ? value.id : crypto.randomUUID(),
    name: value.name.trim().slice(0, MAX_WHEEL_NAME_LENGTH) || 'Untitled wheel',
    items,
    createdAt,
  }
}

function normalizePayload(value: unknown): SavedWheel[] {
  const source = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.wheels)
      ? value.wheels
      : []

  return source
    .map(normalizeWheel)
    .filter((wheel): wheel is SavedWheel => wheel !== null)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_SAVED_WHEELS)
}

function getWheels(): SavedWheel[] {
  try {
    return normalizePayload(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return []
  }
}

function persist(wheels: SavedWheel[]): void {
  try {
    const payload: StoredWheelsPayload = {
      version: STORAGE_VERSION,
      wheels: normalizePayload(wheels),
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('storageFull')
    }
    throw e
  }
}

function saveWheel(wheel: SavedWheel): void {
  const cleanWheel = normalizeWheel(wheel)
  if (!cleanWheel) {
    throw new Error('invalidWheel')
  }
  const wheels = getWheels()
  const idx = wheels.findIndex((w) => w.id === cleanWheel.id)
  if (idx >= 0) wheels[idx] = cleanWheel
  else wheels.unshift(cleanWheel)
  persist(wheels)
}

function deleteWheel(id: string): void {
  persist(getWheels().filter((w) => w.id !== id))
}

export const storage = { getWheels, saveWheel, deleteWheel }
