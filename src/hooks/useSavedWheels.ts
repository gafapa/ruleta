import { useState, useCallback } from 'react'
import type { SavedWheel, WheelItem } from '../types'
import { storage } from '../services/storage'
import { useI18n } from '../services/i18n'

export function useSavedWheels() {
  const { t } = useI18n()
  const [wheels, setWheels] = useState<SavedWheel[]>(() => storage.getWheels())
  const [error, setError] = useState<string | null>(null)

  const saveWheel = useCallback((name: string, items: WheelItem[]): boolean => {
    if (!name.trim()) return false
    const wheel: SavedWheel = {
      id: crypto.randomUUID(),
      name: name.slice(0, 40),
      items,
      createdAt: Date.now(),
    }
    try {
      storage.saveWheel(wheel)
      setWheels(storage.getWheels())
      setError(null)
      return true
    } catch (e) {
      const message = e instanceof Error ? e.message : 'saveError'
      setError(t(message))
      return false
    }
  }, [t])

  const deleteWheel = useCallback((id: string) => {
    storage.deleteWheel(id)
    setWheels(storage.getWheels())
    setError(null)
  }, [])

  return { wheels, saveWheel, deleteWheel, error }
}
