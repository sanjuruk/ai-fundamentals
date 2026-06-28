import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

type Tone = 'default' | 'success' | 'warning'

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ui-card', className)} {...props} />
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }) {
  return <button className={cx('ui-button', `ui-button-${variant}`, className)} {...props} />
}

export function Progress({
  value,
  className,
  tone = 'success',
}: {
  value: number
  className?: string
  tone?: Tone
}) {
  const bounded = Math.max(0, Math.min(100, value))

  return (
    <span
      className={cx('ui-progress', `ui-progress-${tone}`, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={bounded}
    >
      <span style={{ width: `${bounded}%` }} />
    </span>
  )
}

export function Stat({
  label,
  value,
  detail,
  tone = 'default',
}: {
  label: string
  value: ReactNode
  detail?: string
  tone?: Tone
}) {
  return (
    <div className={cx('ui-stat', `ui-stat-${tone}`)}>
      <span className="ui-stat-value">{value}</span>
      <span className="ui-stat-label">{label}</span>
      {detail && <span className="ui-stat-detail">{detail}</span>}
    </div>
  )
}
