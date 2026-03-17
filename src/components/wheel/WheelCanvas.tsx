import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { WheelPointer } from './WheelPointer'
import { useWheel } from '../../hooks/useWheel'
import type { WheelItem, SpinResult } from '../../types'
import type { WheelStyleId } from '../../services/wheelStyles'

interface WheelCanvasProps {
  items: WheelItem[]
  styleId: WheelStyleId
  onResult: (result: SpinResult) => void
  onSpinStart: () => void
  onSpinEnd: () => void
  spinTrigger: number
  onSpin: () => void
  isSpinning: boolean
  canSpin: boolean
}

export function WheelCanvas({
  items,
  styleId,
  onResult,
  onSpinStart,
  onSpinEnd,
  spinTrigger,
  onSpin,
  isSpinning,
  canSpin,
}: WheelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { canvasRef, spin, initCanvas, redraw } = useWheel({
    items,
    styleId,
    onResult,
    onSpinStart,
    onSpinEnd,
  })

  // Re-init on resize so canvas always matches actual pixel size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => initCanvas())
    ro.observe(el)
    return () => ro.disconnect()
  }, [initCanvas])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  useEffect(() => {
    redraw()
  }, [redraw])

  useEffect(() => {
    if (spinTrigger > 0) spin()
  }, [spinTrigger, spin])

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative w-full aspect-square rounded-full transition-all duration-200',
        canSpin && !isSpinning && 'cursor-pointer hover:ring-4 hover:ring-violet-300/40',
        !canSpin && 'cursor-not-allowed',
        isSpinning && 'cursor-default',
      )}
      onClick={canSpin && !isSpinning ? onSpin : undefined}
    >
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          transform: 'scale(1.1)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-full"
      />
      <WheelPointer />
    </div>
  )
}
