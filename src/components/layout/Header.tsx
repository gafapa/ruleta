import { useRef, useState } from 'react'
import { Pencil, Check } from 'lucide-react'

interface HeaderProps {
  wheelName: string
  onNameChange: (name: string) => void
  itemCount: number
  view: 'setup' | 'play'
}

function WheelIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" stroke="url(#wg)" strokeWidth="2" />
      <circle cx="14" cy="14" r="3" fill="#5b21b6" opacity="0.9" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 14 + 4 * Math.cos(rad)
        const y1 = 14 + 4 * Math.sin(rad)
        const x2 = 14 + 11 * Math.cos(rad)
        const y2 = 14 + 11 * Math.sin(rad)
        return (
          <line
            key={deg}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#7C3AED"
            strokeWidth="1.5"
            opacity="0.7"
          />
        )
      })}
      {/* Pointer */}
      <polygon points="14,2 12.5,6 15.5,6" fill="#5b21b6" />
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="0.5" stopColor="#06B6D4" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Header({ wheelName, onNameChange, itemCount, view }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(wheelName)
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 10)
  }

  function commitEdit() {
    const val = draft.trim()
    if (val) onNameChange(val)
    setIsEditing(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-5"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124,58,237,0.12)',
        boxShadow: '0 1px 12px rgba(124,58,237,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-5">
        <WheelIcon />
        <span className="text-lg font-black tracking-tight hidden sm:block"
          style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Ruleta
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-violet-200 mr-5 hidden sm:block" />

      {/* Wheel name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') setIsEditing(false)
              }}
              maxLength={40}
              className="bg-violet-50 border border-violet-300 rounded-lg px-3 py-1 text-sm font-semibold text-slate-800 focus:outline-none min-w-0 max-w-52"
              autoFocus
            />
            <button
              onMouseDown={(e) => {
                e.preventDefault()
                commitEdit()
              }}
              className="p-1 rounded-lg text-violet-600 hover:bg-violet-100 transition-all"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 group text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors truncate max-w-full"
          >
            <span className="truncate">{wheelName}</span>
            <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 shrink-0 transition-colors" />
          </button>
        )}
      </div>

      {/* Right */}
      <div className="ml-auto shrink-0 flex items-center gap-3">
        {itemCount > 0 && (
          <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-3 py-1">
            {itemCount} elemento{itemCount !== 1 ? 's' : ''}
          </span>
        )}
        {view === 'play' && (
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
            Jugando
          </span>
        )}
      </div>
    </header>
  )
}
