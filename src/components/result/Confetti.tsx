import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const COLORS = [
  '#7C3AED', '#06B6D4', '#EC4899', '#F59E0B',
  '#10B981', '#EF4444', '#8B5CF6', '#F97316',
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  life: number // 0→1 progress
  shape: 'rect' | 'circle'
}

interface ConfettiProps {
  onDone: () => void
}

export function Confetti({ onDone }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 5,
      vy: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      size: 6 + Math.random() * 9,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      life: 0,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))

    const duration = 3500
    const startTime = performance.now()
    let raf: number

    function draw(now: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      const elapsed = now - startTime
      const globalT = elapsed / duration

      let allDone = true

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity
        p.rotation += p.rotationSpeed
        p.life = Math.min(globalT * 1.5, 1)

        if (p.life > 0.7) {
          p.opacity = Math.max(0, 1 - (p.life - 0.7) / 0.3)
        }

        if (p.y < canvas!.height + 20) allDone = false

        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate(p.rotation)
        ctx!.globalAlpha = p.opacity
        ctx!.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx!.beginPath()
          ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx!.fill()
        }

        ctx!.restore()
      }

      if (elapsed < duration && !allDone) {
        raf = requestAnimationFrame(draw)
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
        onDone()
      }
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return createPortal(
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />,
    document.body,
  )
}
