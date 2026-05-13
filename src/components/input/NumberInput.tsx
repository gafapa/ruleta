import { useState } from 'react'
import { Hash } from 'lucide-react'
import { Button } from '../ui/Button'
import type { WheelItem } from '../../types'
import { generatePalette } from '../../services/colors'
import { buildItems } from '../../services/wheel'
import { MAX_WHEEL_ITEMS } from '../../services/limits'
import { useI18n } from '../../services/i18n'

interface NumberInputProps {
  onItems: (items: WheelItem[]) => void
}

export function NumberInput({ onItems }: NumberInputProps) {
  const { t } = useI18n()
  const [value, setValue] = useState('10')
  const n = Math.max(2, Math.min(MAX_WHEEL_ITEMS, parseInt(value) || 0))
  const isValid = !isNaN(parseInt(value)) && n >= 2 && n <= MAX_WHEEL_ITEMS

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
            max={MAX_WHEEL_ITEMS}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-all"
            placeholder="10"
          />
        </div>
        <Button onClick={handleGenerate} disabled={!isValid} size="md">
          {t('generate')}
        </Button>
      </div>

      {isValid && (
        <p className="text-xs text-slate-500">
          {t('numbersPreview', { count: n })}
        </p>
      )}
      {!isValid && value !== '' && (
        <p className="text-xs text-red-500">{t('numbersInvalid', { count: MAX_WHEEL_ITEMS })}</p>
      )}
    </div>
  )
}
