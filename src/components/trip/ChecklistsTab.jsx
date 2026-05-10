import { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Plus, Trash2, ListChecks } from 'lucide-react'
import EmptyState from '../ui/EmptyState'

export default function ChecklistsTab({ tripId, canEdit, members }) {
  const [lists, setLists] = useState([])
  useEffect(() => {
    const q = query(collection(db, 'trips', tripId, 'checklists'), orderBy('createdAt'))
    return onSnapshot(q, (s) => setLists(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [tripId])

  const addList = async () => {
    const title = prompt('Checklist title (e.g. Packing)')
    if (!title) return
    await addDoc(collection(db, 'trips', tripId, 'checklists'), { title, createdAt: serverTimestamp() })
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold">Checklists</h2>
        {canEdit && <button onClick={addList} className="btn-primary"><Plus className="w-4 h-4" /> New list</button>}
      </div>
      {lists.length === 0 ? (
        <EmptyState icon={ListChecks} title="No checklists yet" description="Create lists for packing, documents, pre-trip tasks, and more." />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {lists.map((l) => <ChecklistCard key={l.id} tripId={tripId} list={l} canEdit={canEdit} members={members} />)}
        </div>
      )}
    </div>
  )
}

function ChecklistCard({ tripId, list, canEdit, members }) {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  useEffect(() => onSnapshot(collection(db, 'trips', tripId, 'checklists', list.id, 'items'),
    (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() })))), [tripId, list.id])

  const add = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    await addDoc(collection(db, 'trips', tripId, 'checklists', list.id, 'items'),
      { text: newItem, done: false, createdAt: serverTimestamp() })
    setNewItem('')
  }
  const toggle = (it) => updateDoc(doc(db, 'trips', tripId, 'checklists', list.id, 'items', it.id), { done: !it.done })
  const removeItem = (id) => deleteDoc(doc(db, 'trips', tripId, 'checklists', list.id, 'items', id))
  const removeList = () => confirm(`Delete "${list.title}"?`) && deleteDoc(doc(db, 'trips', tripId, 'checklists', list.id))

  const done = items.filter((i) => i.done).length
  const pct = items.length ? (done / items.length) * 100 : 0

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">{list.title}</h3>
        {canEdit && <button onClick={removeList} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>}
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-1.5 mb-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-2 text-sm group">
            <input type="checkbox" checked={it.done} onChange={() => toggle(it)} className="w-4 h-4 accent-brand-600" />
            <span className={`flex-1 ${it.done ? 'line-through text-slate-400' : ''}`}>{it.text}</span>
            {canEdit && <button onClick={() => removeItem(it.id)} className="opacity-0 group-hover:opacity-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>
      {canEdit && (
        <form onSubmit={add} className="flex gap-2">
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)} className="input text-sm" placeholder="Add an item..." />
          <button className="btn-primary px-3"><Plus className="w-4 h-4" /></button>
        </form>
      )}
    </div>
  )
}
