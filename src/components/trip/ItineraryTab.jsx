import { useEffect, useState } from 'react'
import {
  collection, addDoc, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, Clock, MapPin, GripVertical, Check, FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import EmptyState from '../ui/EmptyState'

const categories = ['food', 'sightseeing', 'transport', 'lodging', 'activity', 'other']

export default function ItineraryTab({ tripId, canEdit }) {
  const [days, setDays] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'trips', tripId, 'itineraryDays'), orderBy('order'))
    return onSnapshot(q, (s) => setDays(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [tripId])

  const addDay = async () => {
    await addDoc(collection(db, 'trips', tripId, 'itineraryDays'), {
      title: `Day ${days.length + 1}`, order: days.length, createdAt: serverTimestamp(),
    })
  }

  const exportPdf = async () => {
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().from(document.getElementById('itinerary-print')).save('itinerary.pdf')
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold">Itinerary</h2>
        <div className="flex gap-2">
          <button onClick={exportPdf} className="btn-outline"><FileDown className="w-4 h-4" /> Export PDF</button>
          {canEdit && <button onClick={addDay} className="btn-primary"><Plus className="w-4 h-4" /> Add day</button>}
        </div>
      </div>

      <div id="itinerary-print" className="space-y-4">
        {days.length === 0 ? (
          <EmptyState icon={Clock} title="No days planned"
            description="Start by adding your first day, then plug in activities."
            action={canEdit && <button onClick={addDay} className="btn-primary"><Plus className="w-4 h-4" /> Add first day</button>} />
        ) : days.map((day) => <DayBlock key={day.id} tripId={tripId} day={day} canEdit={canEdit} />)}
      </div>
    </div>
  )
}

function DayBlock({ tripId, day, canEdit }) {
  const [activities, setActivities] = useState([])
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    const q = query(collection(db, 'trips', tripId, 'itineraryDays', day.id, 'activities'), orderBy('order'))
    return onSnapshot(q, (s) => setActivities(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [tripId, day.id])

  const addActivity = async () => {
    await addDoc(collection(db, 'trips', tripId, 'itineraryDays', day.id, 'activities'), {
      title: 'New activity', time: '09:00', category: 'sightseeing', order: activities.length,
      completed: false, location: '', notes: '', createdAt: serverTimestamp(),
    })
  }

  const onDragEnd = async (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = activities.findIndex((a) => a.id === active.id)
    const newIdx = activities.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(activities, oldIdx, newIdx)
    setActivities(reordered)
    const batch = writeBatch(db)
    reordered.forEach((a, i) => batch.update(doc(db, 'trips', tripId, 'itineraryDays', day.id, 'activities', a.id), { order: i }))
    await batch.commit()
  }

  const deleteDay = async () => {
    if (!confirm('Delete this day and all its activities?')) return
    // Delete activities
    const batch = writeBatch(db)
    activities.forEach((a) => batch.delete(doc(db, 'trips', tripId, 'itineraryDays', day.id, 'activities', a.id)))
    batch.delete(doc(db, 'trips', tripId, 'itineraryDays', day.id))
    await batch.commit()
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <input
          defaultValue={day.title} disabled={!canEdit}
          onBlur={(e) => updateDoc(doc(db, 'trips', tripId, 'itineraryDays', day.id), { title: e.target.value })}
          className="font-display text-xl font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/40 rounded px-1 -mx-1" />
        {canEdit && (
          <div className="flex gap-2">
            <button onClick={addActivity} className="btn-ghost text-sm"><Plus className="w-4 h-4" /> Activity</button>
            <button onClick={deleteDay} className="btn-ghost text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {activities.map((a) => <ActivityCard key={a.id} tripId={tripId} dayId={day.id} activity={a} canEdit={canEdit} />)}
          </div>
        </SortableContext>
      </DndContext>
      {activities.length === 0 && (
        <div className="text-center text-sm text-slate-400 py-6">No activities yet.</div>
      )}
    </div>
  )
}

function ActivityCard({ tripId, dayId, activity, canEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }

  const ref = doc(db, 'trips', tripId, 'itineraryDays', dayId, 'activities', activity.id)
  const update = (data) => updateDoc(ref, data)
  const remove = () => deleteDoc(ref)

  return (
    <div ref={setNodeRef} style={style}
      className={`group flex items-start gap-3 p-3 rounded-xl border ${activity.completed ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
      {canEdit && (
        <button {...attributes} {...listeners} className="opacity-30 group-hover:opacity-100 cursor-grab pt-1">
          <GripVertical className="w-4 h-4" />
        </button>
      )}
      <button onClick={() => update({ completed: !activity.completed })}
        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${activity.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
        {activity.completed && <Check className="w-3 h-3" />}
      </button>
      <div className="flex-1 min-w-0 space-y-1">
        <input defaultValue={activity.title} disabled={!canEdit}
          onBlur={(e) => update({ title: e.target.value })}
          className={`w-full bg-transparent font-medium focus:outline-none ${activity.completed ? 'line-through text-slate-400' : ''}`} />
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
            <input type="time" defaultValue={activity.time} disabled={!canEdit}
              onBlur={(e) => update({ time: e.target.value })}
              className="bg-transparent w-20 focus:outline-none" />
          </span>
          <select defaultValue={activity.category} disabled={!canEdit}
            onChange={(e) => update({ category: e.target.value })}
            className="bg-transparent capitalize focus:outline-none">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="flex items-center gap-1 flex-1 min-w-[120px]"><MapPin className="w-3 h-3" />
            <input defaultValue={activity.location} placeholder="Location" disabled={!canEdit}
              onBlur={(e) => update({ location: e.target.value })}
              className="bg-transparent flex-1 focus:outline-none" />
          </span>
        </div>
      </div>
      {canEdit && (
        <button onClick={remove} className="opacity-0 group-hover:opacity-100 text-red-500 p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
