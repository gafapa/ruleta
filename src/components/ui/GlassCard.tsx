import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: 'violet' | 'cyan' | 'pink'
}

export function GlassCard({ children, className, glow }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass p-5 shadow-xl shadow-violet-100',
        glow === 'violet' && 'glow-violet',
        glow === 'cyan' && 'glow-cyan',
        glow === 'pink' && 'glow-pink',
        className,
      )}
    >
      {children}
    </div>
  )
}
