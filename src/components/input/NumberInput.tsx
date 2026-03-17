import { useState } from 'react'
import { Hash } from 'lucide-react'
import { Button } from '../ui/Button'
import type { WheelItem } from '../../types'
import { generatePalette } from '../../services/colors'
import { buildItems } from '../../services/wheel'

interface NumberInputProps {
  onItems: (items: WheelItem[]) => void
}

export function NumberInput({ onItems }: NumberInputProps) {
  const [value, setValue] = useState('10')
  const n = Math.max(2, Math.min(100, parseInt(value) || 0))
  const isValid = !isNaN(parseInt(value)) && n >= 2 && n <= 100

  function handleGenerate() {
    if (!isValid) return
    const labels = Array.from({ length: n }, (_, i) => String(i + 1))
    const palette = generatePalette(n)
    onItems(buildItems(labels, palette))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="number"
            min="2"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-all"
            placeholder="10"
          />
        </div>
        <Button onClick={handleGenerate} disabled={!isValid} size="md">
          Generar
        </Button>
      </div>

      {isValid && (
        <p className="text-xs text-slate-500">
          Se crearán <span className="text-violet-600 font-semibold">{n}</span> elementos (1 al {n})
        </p>
      )}
      {!isValid && value !== '' && (
        <p className="text-xs text-red-500">Ingresa un número entre 2 y 100</p>
      )}
    </div>
  )
}
