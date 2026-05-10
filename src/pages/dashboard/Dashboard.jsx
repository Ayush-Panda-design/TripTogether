import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { watchUserTrips } from '../../features/trips/tripService'
import TripCard from '../../components/dashboard/TripCard.jsx'
import CreateTripModal from '../../components/dashboard/CreateTripModal.jsx'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import StatsRow from '../../components/dashboard/StatsRow.jsx'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [trips, setTrips] = useState(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    return watchUserTrips(user.uid, setTrips)
  }, [user])

  const filtered = (trips || []).filter((t) => {
    if (filter === 'archived' && !t.archived) return false
    if (filter !== 'archived' && t.archived) return false
    if (filter === 'shared' && t.ownerId === user.uid) return false
    if (filter === 'mine' && t.ownerId !== user.uid) return false
    if (search && !`${t.title} ${t.destination}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Hey, {profile?.name?.split(' ')[0] || 'traveler'} 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's on your horizon.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> New trip</button>
      </div>

      <StatsRow trips={trips || []} />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search trips..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {['all','mine','shared','archived'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${filter===f?'bg-white dark:bg-slate-900 shadow-sm':'text-slate-600 dark:text-slate-300'}`}>{f}</button>
          ))}
        </div>
      </div>

      {trips === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Sparkles} title="No trips yet"
          description="Start your first adventure — invite your crew and plan it together."
          action={<button onClick={() => setOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Create trip</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => <TripCard key={t.id} trip={t} />)}
        </div>
      )}

      <CreateTripModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
