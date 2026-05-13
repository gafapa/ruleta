import { Trash2, Clock } from 'lucide-react'
import type { SavedWheel } from '../../types'
import { getItemPluralSuffix, useI18n } from '../../services/i18n'

interface SavedWheelCardProps {
  wheel: SavedWheel
  onLoad: () => void
  onDelete: () => void
}

function formatDate(ts: number, locale: string): string {
  const d = new Date(ts)
  return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export function SavedWheelCard({ wheel, onLoad, onDelete }: SavedWheelCardProps) {
  const { language, locale, t } = useI18n()
  const swatches = wheel.items.slice(0, 6)

  return (
    <div className="glass-sm p-3 group hover:bg-slate-50 transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Color swatches */}
        <div className="flex gap-0.5 flex-wrap w-12 shrink-0 mt-0.5">
          {swatches.map((item, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-md"
              style={{ backgroundColor: item.color, boxShadow: `0 0 4px ${item.color}50` }}
            />
          ))}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{wheel.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-violet-600">
              {t('itemCount', {
                count: wheel.items.length,
                plural: getItemPluralSuffix(language, wheel.items.length),
              })}
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {formatDate(wheel.createdAt, locale)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onLoad}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-all"
          >
            {t('load')}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title={t('deleteWheel', { name: wheel.name })}
            aria-label={t('deleteWheel', { name: wheel.name })}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
