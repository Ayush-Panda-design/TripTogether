export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      {Icon && (
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-100 to-violet-100 dark:from-brand-900/40 dark:to-violet-900/40 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
