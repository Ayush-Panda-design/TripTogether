import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { differenceInDays } from 'date-fns'
import { Wallet, Plane, Hotel, ListChecks } from 'lucide-react'
import Avatar from '../ui/Avatar'

export default function OverviewTab({ trip, members }) {
  const [expenses, setExpenses] = useState([])
  const [reservations, setReservations] = useState([])
  useEffect(() => onSnapshot(collection(db, 'trips', trip.id, 'expenses'), (s) => setExpenses(s.docs.map(d => d.data()))), [trip.id])
  useEffect(() => onSnapshot(collection(db, 'trips', trip.id, 'reservations'), (s) => setReservations(s.docs.map(d => d.data()))), [trip.id])

  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const daysToGo = trip.startDate ? Math.max(0, differenceInDays(new Date(trip.startDate), new Date())) : 0

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold mb-2">About this trip</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{trip.description || 'No description yet.'}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat icon={Wallet} label="Total spent" value={`$${totalSpent.toFixed(0)}`} color="from-emerald-500 to-teal-600" />
          <Stat icon={Plane} label="Reservations" value={reservations.length} color="from-brand-500 to-blue-600" />
          <Stat icon={ListChecks} label="Travelers" value={members.length} color="from-violet-500 to-fuchsia-600" />
        </div>
      </div>
      <div className="space-y-5">
        <div className="card p-6 text-center bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-900/20 dark:to-violet-900/20">
          <div className="text-xs uppercase tracking-wider text-slate-500">Countdown</div>
          <div className="font-display text-5xl font-bold mt-1 bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">{daysToGo}</div>
          <div className="text-sm text-slate-500 mt-1">days to go</div>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-semibold mb-3">Travelers</h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.uid} className="flex items-center gap-3">
                <Avatar name={m.name} src={m.avatar} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${color} text-white flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-display font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}
