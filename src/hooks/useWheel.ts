import { useRef, useCallback } from 'react'
import type { WheelItem, SpinResult } from '../types'
import { easeOutQuartic, computeSpinAngle } from '../services/wheel'
import { contrastTextColor } from '../services/colors'
import { getStyle, type WheelStyleId } from '../services/wheelStyles'

function truncateLabel(ctx: CanvasRenderingContext2D, label: string, maxWidth: number): string {
  if (ctx.measureText(label).width <= maxWidth) return label
  let truncated = label
  while (truncated.length > 1 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1)
  }
  return truncated + '…'
}

function drawWheel(
  canvas: HTMLCanvasElement,
  angle: number,
  items: WheelItem[],
  styleId: WheelStyleId = 'clasica',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const style = getStyle(styleId)
  const dpr = window.devicePixelRatio ?? 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr
  const cx = w / 2
  const cy = h / 2
  const outerR = w / 2 - 10
  const n = items.length

  ctx.clearRect(0, 0, w, h)

  // Dark background (e.g. neon style)
  if (style.canvasBg) {
    ctx.fillStyle = style.canvasBg
    ctx.fillRect(0, 0, w, h)
    // Subtle radial glow from center
    const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR)
    bgGlow.addColorStop(0, 'rgba(120,0,200,0.15)')
    bgGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = bgGlow
    ctx.fillRect(0, 0, w, h)
  }

  if (n === 0) {
    ctx.fillStyle = style.canvasBg ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.06)'
    ctx.beginPath()
    ctx.arc(cx, cy, outerR, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = style.canvasBg ? 'rgba(255,255,255,0.15)' : 'rgba(124,58,237,0.2)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = style.canvasBg ? 'rgba(255,255,255,0.5)' : 'rgba(30,27,75,0.35)'
    ctx.font = '600 18px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Añade elementos', cx, cy)
    return
  }

  const segAngle = (2 * Math.PI) / n
  const fontSize = Math.max(9, Math.min(15, 180 / n))

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angle)
  ctx.translate(-cx, -cy)

  for (let i = 0; i < n; i++) {
    const color = style.colors[i % style.colors.length]!
    const startA = i * segAngle
    const endA = startA + segAngle

    // Segment fill
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, outerR, startA, endA)
    ctx.closePath()

    if (style.glowSegments) {
      ctx.shadowColor = color
      ctx.shadowBlur = 18
    }
    ctx.fillStyle = color
    ctx.fill()
    ctx.shadowBlur = 0

    // Segment border
    ctx.strokeStyle = style.borderColor
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Label
    const midA = startA + segAngle / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(midA)
    const labelX = outerR * 0.62
    const maxLabelWidth = outerR * 0.52
    ctx.font = `600 ${fontSize}px Inter, sans-serif`
    const textColor = style.glowSegments ? '#ffffff' : contrastTextColor(color)
    ctx.fillStyle = textColor

    if (style.glowSegments) {
      ctx.shadowColor = color
      ctx.shadowBlur = 10
    } else {
      ctx.shadowColor = textColor === '#ffffff' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.5)'
      ctx.shadowBlur = 3
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const label = truncateLabel(ctx, items[i]!.label, maxLabelWidth)
    ctx.fillText(label, labelX, 0)
    ctx.shadowBlur = 0
    ctx.restore()
  }

  ctx.restore()

  // Decorative tick marks
  ctx.save()
  ctx.translate(cx, cy)
  const tickCount = Math.min(72, n * 4)
  for (let i = 0; i < tickCount; i++) {
    const a = (i / tickCount) * 2 * Math.PI
    ctx.save()
    ctx.rotate(a)
    ctx.strokeStyle = style.tickColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(outerR - 2, 0)
    ctx.lineTo(outerR + 6, 0)
    ctx.stroke()
    ctx.restore()
  }
  ctx.restore()

  // Outer border ring with glow
  const [r1, r2, r3] = style.ringColors
  const gradient = ctx.createLinearGradient(cx - outerR, cy, cx + outerR, cy)
  gradient.addColorStop(0, r1 + 'cc')
  gradient.addColorStop(0.5, r2 + 'cc')
  gradient.addColorStop(1, r3 + 'cc')
  ctx.beginPath()
  ctx.arc(cx, cy, outerR + 4, 0, 2 * Math.PI)
  ctx.strokeStyle = gradient
  ctx.lineWidth = style.glowSegments ? 4 : 3
  if (style.glowSegments) {
    ctx.shadowColor = r1
    ctx.shadowBlur = 20
  } else {
    ctx.shadowColor = r1 + '99'
    ctx.shadowBlur = 16
  }
  ctx.stroke()
  ctx.shadowBlur = 0

  // Center hub
  const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28)
  hubGrad.addColorStop(0, style.hubInner)
  hubGrad.addColorStop(0.5, style.hubMid)
  hubGrad.addColorStop(1, style.hubOuter)
  ctx.beginPath()
  ctx.arc(cx, cy, 24, 0, 2 * Math.PI)
  ctx.fillStyle = hubGrad
  if (style.glowSegments) {
    ctx.shadowColor = style.ringColors[0]
    ctx.shadowBlur = 16
  } else {
    ctx.shadowColor = style.ringColors[0] + '80'
    ctx.shadowBlur = 12
  }
  ctx.fill()
  ctx.shadowBlur = 0

  // Hub border
  ctx.beginPath()
  ctx.arc(cx, cy, 24, 0, 2 * Math.PI)
  ctx.strokeStyle = style.hubOuter
  ctx.lineWidth = 2
  ctx.stroke()
}

interface UseWheelOptions {
  items: WheelItem[]
  styleId: WheelStyleId
  onResult: (result: SpinResult) => void
  onSpinStart: () => void
  onSpinEnd: () => void
}

export function useWheel({ items, styleId, onResult, onSpinStart, onSpinEnd }: UseWheelOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const isSpinningRef = useRef(false)

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio ?? 1
    // Use the container's actual CSS size so the wheel is always crisp
    const size = canvas.parentElement?.clientWidth || canvas.clientWidth || 520
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
    drawWheel(canvas, angleRef.current, items, styleId)
  }, [items, styleId])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawWheel(canvas, angleRef.current, items, styleId)
  }, [items, styleId])

  const spin = useCallback(() => {
    if (isSpinningRef.current || items.length < 2) return

    const canvas = canvasRef.current
    if (!canvas) return

    isSpinningRef.current = true
    onSpinStart()

    const targetIndex = Math.floor(Math.random() * items.length)
    const extraRotations = 5 + Math.floor(Math.random() * 4)
    const totalDelta = computeSpinAngle(angleRef.current, targetIndex, items.length, extraRotations)
    const startAngle = angleRef.current
    const targetAngle = startAngle + totalDelta
    const duration = 4000 + Math.random() * 2000
    const startTime = performance.now()
    const style = getStyle(styleId)
    const displayColor = style.colors[targetIndex % style.colors.length]!

    function frame(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easeOutQuartic(t)
      angleRef.current = startAngle + totalDelta * eased
      drawWheel(canvas!, angleRef.current, items, styleId)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        angleRef.current = targetAngle
        isSpinningRef.current = false
        onSpinEnd()
        onResult({ item: items[targetIndex]!, segmentIndex: targetIndex, displayColor })
      }
    }

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(frame)
  }, [items, styleId, onResult, onSpinStart, onSpinEnd])

  return { canvasRef, spin, initCanvas, redraw }
}
