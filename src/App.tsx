import { useReducer, useCallback, useState, useRef, useEffect } from 'react'
import { Play, ArrowLeft, BookmarkPlus, RotateCcw } from 'lucide-react'
import type { AppState, AppAction, SpinResult } from './types'
import { Header } from './components/layout/Header'
import { WheelCanvas } from './components/wheel/WheelCanvas'
import { StylePicker } from './components/wheel/StylePicker'
import { InputPanel } from './components/input/InputPanel'
import { SavedWheelsPanel } from './components/saved/SavedWheelsPanel'
import { ResultModal } from './components/result/ResultModal'
import { Confetti } from './components/result/Confetti'
import { Button } from './components/ui/Button'
import { GlassCard } from './components/ui/GlassCard'
import { useSavedWheels } from './hooks/useSavedWheels'
import { DEFAULT_STYLE_ID, type WheelStyleId } from './services/wheelStyles'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

const initialState: AppState = {
  items: [],
  wheelName: 'Mi Ruleta',
  isSpinning: false,
  result: null,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, result: null }
    case 'SET_WHEEL_NAME':
      return { ...state, wheelName: action.payload }
    case 'SET_SPINNING':
      return { ...state, isSpinning: action.payload }
    case 'SET_RESULT':
      return { ...state, result: action.payload, isSpinning: false }
    case 'ELIMINATE_RESULT': {
      if (!state.result) return state
      const id = state.result.item.id
      return {
        ...state,
        items: state.items.filter((item) => item.id !== id),
        result: null,
      }
    }
    case 'LOAD_WHEEL':
      return {
        ...state,
        items: action.payload.items,
        wheelName: action.payload.name,
        result: null,
      }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [view, setView] = useState<'setup' | 'play'>('setup')
  const [spinTrigger, setSpinTrigger] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [wheelStyleId, setWheelStyleId] = useState<WheelStyleId>(DEFAULT_STYLE_ID)
  const originalItemsRef = useRef(initialState.items)
  const { wheels, saveWheel, deleteWheel, error: saveError } = useSavedWheels()
  const [isSavingWheel, setIsSavingWheel] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const syncInstalledState = () => {
      const iosStandalone =
        'standalone' in window.navigator &&
        Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
      setIsInstalled(media.matches || iosStandalone)
    }

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setInstallPrompt(event)
    }

    const handleInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    syncInstalledState()
    media.addEventListener('change', syncInstalledState)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      media.removeEventListener('change', syncInstalledState)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  function handleSaveWheel() {
    const name = saveName.trim() || state.wheelName
    const ok = saveWheel(name, state.items)
    if (ok) {
      setSaveName('')
      setIsSavingWheel(false)
      setSavedFeedback(true)
      setTimeout(() => setSavedFeedback(false), 2000)
    }
  }

  const handleResult = useCallback(
    (result: SpinResult) => {
      dispatch({ type: 'SET_RESULT', payload: result })
      setShowConfetti(true)
    },
    [],
  )

  const handleSpinStart = useCallback(() => {
    dispatch({ type: 'SET_SPINNING', payload: true })
    setShowConfetti(false)
  }, [])

  const handleSpinEnd = useCallback(() => {
    dispatch({ type: 'SET_SPINNING', payload: false })
  }, [])

  const handleSpin = useCallback(() => {
    setSpinTrigger((t) => t + 1)
  }, [])

  const handleCloseResult = useCallback(() => {
    dispatch({ type: 'SET_RESULT', payload: null })
    setShowConfetti(false)
  }, [])

  const handleContinue = useCallback(() => {
    dispatch({ type: 'SET_RESULT', payload: null })
    setShowConfetti(false)
    setSpinTrigger((t) => t + 1)
  }, [])

  const handleEliminate = useCallback(() => {
    dispatch({ type: 'ELIMINATE_RESULT' })
    setShowConfetti(false)
  }, [])

  const handleReset = useCallback(() => {
    dispatch({ type: 'SET_ITEMS', payload: originalItemsRef.current })
    setShowConfetti(false)
  }, [])

  const handleInstallApp = useCallback(async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }, [installPrompt])

  return (
    <div className="min-h-screen font-display">
      <Header
        wheelName={state.wheelName}
        onNameChange={(name) => dispatch({ type: 'SET_WHEEL_NAME', payload: name })}
        itemCount={state.items.length}
        view={view}
        canInstall={installPrompt !== null}
        isInstalled={isInstalled}
        onInstall={handleInstallApp}
      />

      {view === 'setup' ? (
        <main className="pt-20 px-4 pb-12">
          <div className="max-w-lg mx-auto flex flex-col gap-5 animate-fade-in">
            <InputPanel
              items={state.items}
              onItemsChange={(items) => {
                originalItemsRef.current = items
                dispatch({ type: 'SET_ITEMS', payload: items })
              }}
            />

            <Button
              size="lg"
              className="w-full"
              disabled={state.items.length < 2}
              onClick={() => setView('play')}
              title={state.items.length < 2 ? 'Añade al menos 2 elementos' : ''}
            >
              <Play className="w-5 h-5" />
              Jugar
            </Button>

            {/* Save section */}
            <GlassCard className="py-3">
              {isSavingWheel ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveWheel()
                      if (e.key === 'Escape') setIsSavingWheel(false)
                    }}
                    placeholder={state.wheelName || 'Nombre de la ruleta…'}
                    maxLength={40}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-all"
                  />
                  <Button size="sm" onClick={handleSaveWheel}>Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsSavingWheel(false)}>✕</Button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSavingWheel(true)}
                  disabled={state.items.length < 2}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {savedFeedback ? '¡Ruleta guardada!' : 'Guardar ruleta actual'}
                </button>
              )}
            </GlassCard>

            {saveError && (
              <p
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2"
                role="alert"
              >
                {saveError}
              </p>
            )}

            <SavedWheelsPanel
              wheels={wheels}
              onLoad={(items, name) => {
                originalItemsRef.current = items
                dispatch({ type: 'LOAD_WHEEL', payload: { items, name } })
              }}
              onDelete={deleteWheel}
            />
          </div>
        </main>
      ) : (
        <main className="pt-20 px-3 pb-12">
          <div className="max-w-[560px] mx-auto flex flex-col items-center gap-4 animate-fade-in">
            <button
              onClick={() => setView('setup')}
              disabled={state.isSpinning}
              title={state.isSpinning ? 'Espera a que termine el giro' : ''}
              className="self-start flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Editar ruleta
            </button>
            <div className="glass p-3 sm:p-5 w-full">
              <WheelCanvas
                items={state.items}
                styleId={wheelStyleId}
                onResult={handleResult}
                onSpinStart={handleSpinStart}
                onSpinEnd={handleSpinEnd}
                spinTrigger={spinTrigger}
                onSpin={handleSpin}
                isSpinning={state.isSpinning}
                canSpin={state.items.length >= 2}
              />
            </div>

            <StylePicker value={wheelStyleId} onChange={setWheelStyleId} />

            {/* Hint + reset row */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-medium tracking-wider uppercase text-slate-400">
                {state.isSpinning
                  ? 'Girando…'
                  : state.items.length >= 2
                    ? 'Toca la ruleta para girar'
                    : 'Añade al menos 2 elementos'}
              </p>
              {state.items.length < originalItemsRef.current.length && !state.isSpinning && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-600 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar ruleta
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="px-4 pb-6">
        <div className="mx-auto max-w-[560px] text-center text-xs text-slate-400">
          Proyecto:
          {' '}
          <a
            href="https://github.com/gafapa/ruleta"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-violet-600 hover:text-violet-500 transition-colors"
          >
            https://github.com/gafapa/ruleta
          </a>
        </div>
      </footer>

      {state.result && (
        <ResultModal
          result={state.result}
          totalItems={state.items.length}
          onClose={handleCloseResult}
          onContinue={handleContinue}
          onEliminate={handleEliminate}
        />
      )}

      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </div>
  )
}
