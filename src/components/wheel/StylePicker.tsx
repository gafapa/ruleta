import { clsx } from 'clsx'
import { WHEEL_STYLES, type WheelStyleId } from '../../services/wheelStyles'
import { useI18n } from '../../services/i18n'

interface StylePickerProps {
  value: WheelStyleId
  onChange: (id: WheelStyleId) => void
}

export function StylePicker({ value, onChange }: StylePickerProps) {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-2 justify-center flex-wrap" role="group" aria-label={t('stylePickerLabel')}>
      {WHEEL_STYLES.map((style) => {
        const styleName = t(`style.${style.id}`)
        return (
          <button
            type="button"
            key={style.id}
            onClick={() => onChange(style.id)}
            title={styleName}
            aria-pressed={value === style.id}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
              value === style.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600',
            )}
          >
            <span>{style.emoji}</span>
            {styleName}
          </button>
        )
      })}
    </div>
  )
}
