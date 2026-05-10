import { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, orderBy, query, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Plus, Plane, Hotel, Train, Bus, Utensils, Calendar, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import EmptyState from '../ui/EmptyState'
import Modal from '../ui/Modal'

const types = [
  { id: 'flight', icon: Plane, color: 'bg-brand-500' },
  { id: 'hotel', icon: Hotel, color: 'bg-violet-500' },
  { id: 'train', icon: Train, color: 'bg-emerald-500' },
  { id: 'bus', icon: Bus, color: 'bg-amber-500' },
  { id: 'restaurant', icon: Utensils, color: 'bg-pink-500' },
  { id: 'event', icon: Calendar, color: 'bg-cyan-500' },
]

export default function ReservationsTab({ tripId, canEdit }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    const q = query(collection(db, 'trips', tripId, 'reservations'), orderBy('datetime'))
    return onSnapshot(q, (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [tripId])

  const add = async (data) => {
    await addDoc(collection(db, 'trips', tripId, 'reservations'), { ...data, createdAt: serverTimestamp() })
    reset(); setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold">Reservations</h2>
        {canEdit && <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add reservation</button>}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Plane} title="No reservations" description="Add flights, hotels, dinners, and events." />
      ) : (
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-4">
          {items.map((r) => {
            const t = types.find((x) => x.id === r.type) || types[5]
            return (
              <li key={r.id} className="ml-6 relative">
                <span className={`absolute -left-9 top-2 w-7 h-7 rounded-full ${t.color} text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-950`}>
                  <t.icon className="w-4 h-4" />
                </span>
                <div className="card p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="font-display font-semibold">{r.title}</div>
                      <div className="text-xs text-slate-500 capitalize">{r.type} · {r.datetime && format(new Date(r.datetime), 'PP p')}</div>
                      {r.address && <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{r.address}</div>}
                      {r.confirmation && <div className="text-xs text-slate-400 mt-1">Confirmation: {r.confirmation}</div>}
                    </div>
                    <div className="text-right">
                      {r.cost && <div className="font-medium">${r.cost}</div>}
                      {canEdit && <button onClick={() => deleteDoc(doc(db, 'trips', tripId, 'reservations', r.id))} className="text-red-500 mt-1"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add reservation">
        <form onSubmit={handleSubmit(add)} className="space-y-3">
          <select className="input" {...register('type', { required: true })}>
            {types.map((t) => <option key={t.id} value={t.id} className="capitalize">{t.id}</option>)}
          </select>
          <input className="input" placeholder="Title" {...register('title', { required: true })} />
          <input type="datetime-local" className="input" {...register('datetime', { required: true })} />
          <input className="input" placeholder="Address / location" {...register('address')} />
          <input className="input" placeholder="Confirmation number" {...register('confirmation')} />
          <input type="number" step="0.01" className="input" placeholder="Cost" {...register('cost')} />
          <textarea rows={2} className="input" placeholder="Notes" {...register('notes')} />
          <button className="btn-primary w-full">Save reservation</button>
        </form>
      </Modal>
    </div>
  )
}
