import { useState } from 'react'
import { Upload, Hash, X, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'
import { GlassCard } from '../ui/GlassCard'
import { FileUpload } from './FileUpload'
import { NumberInput } from './NumberInput'
import type { WheelItem } from '../../types'
import { generatePalette } from '../../services/colors'

interface InputPanelProps {
  items: WheelItem[]
  onItemsChange: (items: WheelItem[]) => void
}

type Tab = 'file' | 'number' | 'manual'

export function InputPanel({ items, onItemsChange }: InputPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('manual')
  const [newItem, setNewItem] = useState('')
  const [showList, setShowList] = useState(true)

  function handleAddItem() {
    const label = newItem.trim()
    if (!label) return
    const palette = generatePalette(items.length + 1)
    const updated = [
      ...items.map((item, i) => ({ ...item, color: palette[i]! })),
      { id: crypto.randomUUID(), label, color: palette[items.length]! },
    ]
    onItemsChange(updated)
    setNewItem('')
  }

  function handleRemoveItem(id: string) {
    const remaining = items.filter((item) => item.id !== id)
    const palette = generatePalette(remaining.length)
    onItemsChange(remaining.map((item, i) => ({ ...item, color: palette[i]! })))
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'manual', label: 'Manual', icon: <Plus className="w-3.5 h-3.5" /> },
    { id: 'file', label: 'Archivo', icon: <Upload className="w-3.5 h-3.5" /> },
    { id: 'number', label: 'Números', icon: <Hash className="w-3.5 h-3.5" /> },
  ]

  return (
    <GlassCard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Elementos
          </h2>
          {items.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5">
              {items.length}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {activeTab === 'manual' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder="Añadir elemento…"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-all"
              />
              <button
                onClick={handleAddItem}
                disabled={!newItem.trim()}
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
          {activeTab === 'file' && <FileUpload onItems={onItemsChange} />}
          {activeTab === 'number' && <NumberInput onItems={onItemsChange} />}
        </div>

        {/* Items list */}
        {items.length > 0 && (
          <div>
            <button
              onClick={() => setShowList((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-2"
            >
              {showList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showList ? 'Ocultar lista' : 'Mostrar lista'}
            </button>

            {showList && (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 group animate-slide-in"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}60` }}
                    />
                    <span className="flex-1 text-sm text-slate-700 truncate">{item.label}</span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                      aria-label={`Eliminar ${item.label}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {items.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-2">
            Sin elementos — añade algunos para girar la ruleta
          </p>
        )}
      </div>
    </GlassCard>
  )
}
