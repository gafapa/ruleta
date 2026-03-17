import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { SavedWheelCard } from './SavedWheelCard'
import type { SavedWheel, WheelItem } from '../../types'

interface SavedWheelsPanelProps {
  wheels: SavedWheel[]
  onLoad: (items: WheelItem[], name: string) => void
  onDelete: (id: string) => void
}

export function SavedWheelsPanel({ wheels, onLoad, onDelete }: SavedWheelsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <GlassCard>
      <div className="space-y-4">
        {/* Header */}
        <button
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-800 transition-colors"
          onClick={() => setIsExpanded((v) => !v)}
        >
          <BookOpen className="w-4 h-4" />
          Ruletas guardadas
          {wheels.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 normal-case font-normal tracking-normal">
              {wheels.length}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

        {/* List */}
        {isExpanded && (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {wheels.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">
                Aún no hay ruletas guardadas
              </p>
            ) : (
              wheels
                .slice()
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((wheel) => (
                  <SavedWheelCard
                    key={wheel.id}
                    wheel={wheel}
                    onLoad={() => onLoad(wheel.items, wheel.name)}
                    onDelete={() => onDelete(wheel.id)}
                  />
                ))
            )}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
