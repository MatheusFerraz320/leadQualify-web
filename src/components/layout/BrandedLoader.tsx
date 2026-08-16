import { cn } from '../../lib/utils'

type BrandedLoaderProps = {
  variant?: 'fullscreen' | 'inline'
  label?: string
}

export function BrandedLoader({
  variant = 'inline',
  label,
}: BrandedLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        variant === 'fullscreen' &&
          'fixed inset-0 z-[100] bg-slate-100 dark:bg-slate-950',
        variant === 'inline' && 'py-24',
      )}
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-4 rounded-full bg-b2-500/40 blur-xl animate-halo"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-b2-500/30 animate-halo [animation-delay:-1s]"
        />
        <img
          src="/b2DarkLogo.png"
          alt=""
          className="relative h-24 w-24 object-contain animate-float"
        />
      </div>
      {label && (
        <p className="text-sm font-medium text-slate-500 dark:text-white">
          {label}
        </p>
      )}
    </div>
  )
}