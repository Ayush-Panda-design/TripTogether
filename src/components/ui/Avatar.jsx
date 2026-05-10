import { initials } from '../../utils/helpers'
export default function Avatar({ name = '', src, size = 32, className = '' }) {
  return src ? (
    <img src={src} alt={name} style={{ width: size, height: size }}
      className={`rounded-full object-cover ring-2 ring-white dark:ring-slate-900 ${className}`} />
  ) : (
    <div style={{ width: size, height: size, fontSize: size / 2.6 }}
      className={`rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 text-white font-semibold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 ${className}`}>
      {initials(name) || '?'}
    </div>
  )
}
