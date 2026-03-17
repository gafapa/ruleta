import type { SavedWheel } from '../types'

const KEY = 'ruleta_wheels'

function getWheels(): SavedWheel[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as SavedWheel[]
  } catch {
    return []
  }
}

function persist(wheels: SavedWheel[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(wheels))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Almacenamiento lleno. Elimina alguna ruleta guardada.')
    }
    throw e
  }
}

function saveWheel(wheel: SavedWheel): void {
  const wheels = getWheels()
  const idx = wheels.findIndex((w) => w.id === wheel.id)
  if (idx >= 0) wheels[idx] = wheel
  else wheels.push(wheel)
  persist(wheels)
}

function deleteWheel(id: string): void {
  persist(getWheels().filter((w) => w.id !== id))
}

export const storage = { getWheels, saveWheel, deleteWheel }
