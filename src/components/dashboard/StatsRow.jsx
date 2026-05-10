import { Plane, Users, Calendar, Wallet } from 'lucide-react'

export default function StatsRow({ trips }) {
  const upcoming = trips.filter((t) => t.startDate && new Date(t.startDate) >= new Date()).length
  const total = trips.length
  const collaborators = new Set(trips.flatMap((t) => t.memberIds || [])).size
  const stats = [
    { icon: Plane, label: 'Total trips', value: total, color: 'from-brand-500 to-blue-600' },
    { icon: Calendar, label: 'Upcoming', value: upcoming, color: 'from-violet-500 to-fuchsia-600' },
    { icon: Users, label: 'Collaborators', value: collaborators, color: 'from-emerald-500 to-teal-600' },
    { icon: Wallet, label: 'Active plans', value: trips.filter((t) => !t.archived).length, color: 'from-amber-500 to-orange-600' },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="card p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${color} text-white flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
