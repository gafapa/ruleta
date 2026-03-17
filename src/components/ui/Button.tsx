import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100',
        'active:scale-95',
        !props.disabled && 'hover:scale-105',

        // Variants
        variant === 'primary' && [
          'bg-gradient-to-r from-violet-600 to-violet-500 text-white',
          'shadow-lg shadow-violet-500/30',
          !props.disabled && 'hover:shadow-violet-500/50 hover:from-violet-500 hover:to-violet-400',
        ],
        variant === 'secondary' && [
          'bg-violet-50 text-violet-700 border border-violet-200',
          !props.disabled && 'hover:bg-violet-100',
        ],
        variant === 'ghost' && [
          'bg-transparent text-slate-600 border border-slate-200',
          !props.disabled && 'hover:bg-slate-100 hover:text-slate-800',
        ],
        variant === 'danger' && [
          'bg-red-50 text-red-600 border border-red-200',
          !props.disabled && 'hover:bg-red-100 hover:text-red-700',
        ],

        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',

        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
