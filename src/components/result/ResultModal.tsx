import { createPortal } from 'react-dom'
import { X, Trash2, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '../ui/Button'
import type { SpinResult } from '../../types'

interface ResultModalProps {
  result: SpinResult
  totalItems: number
  onClose: () => void
  onContinue: () => void
  onEliminate: () => void
}

export function ResultModal({ result, totalItems, onClose, onContinue, onEliminate }: ResultModalProps) {
  const canEliminate = totalItems > 1
  const color = result.displayColor

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop — click anywhere to close. Sibling to modal. */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(248,247,255,0.88)' }}
        onClick={onClose}
      />

      {/* Centering wrapper — pointer-events-none so out-of-modal clicks fall through to backdrop */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-sm animate-modal-pop pointer-events-auto"
          style={{
            background: 'rgba(255,255,255,0.98)',
            border: `1px solid ${color}30`,
            borderRadius: '1.5rem',
            boxShadow: `0 0 40px ${color}18, 0 24px 48px rgba(124,58,237,0.10)`,
          }}
        >
          {/* Glow blob */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${color}18, transparent)`,
            }}
          />

          {/* X button */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 p-8 text-center space-y-5">
            {/* Trophy */}
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center animate-glow-pulse"
                style={{
                  background: `${color}20`,
                  border: `2px solid ${color}50`,
                  boxShadow: `0 0 24px ${color}40`,
                }}
              >
                <Trophy className="w-7 h-7" style={{ color }} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                ¡Resultado!
              </p>
              <h2
                className="text-4xl font-black leading-tight break-words"
                style={{ color, textShadow: `0 0 30px ${color}70` }}
              >
                {result.item.label}
              </h2>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-400">
                Segmento {result.segmentIndex + 1} de {totalItems}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="md" className="flex-1" onClick={(e) => { e.stopPropagation(); onContinue() }}>
                <RotateCcw className="w-4 h-4" />
                Continuar
              </Button>
              {canEliminate && (
                <Button variant="danger" size="md" className="flex-1" onClick={(e) => { e.stopPropagation(); onEliminate() }}>
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              )}
            </div>

            {!canEliminate && totalItems === 1 && (
              <p className="text-xs text-slate-400">Solo queda 1 elemento</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
