import { useEffect, useRef, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsDropdown() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (s) => setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [user])

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onClick); return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const unread = items.filter((i) => !i.read).length

  const markRead = (id) => updateDoc(doc(db, 'notifications', id), { read: true })

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="btn-ghost p-2 relative">
        <Bell className="w-5 h-5" />
        {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 card overflow-hidden z-40">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-semibold">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8">You're all caught up ✨</div>
            ) : items.map((n) => (
              <Link key={n.id} to={n.tripId ? `/trips/${n.tripId}` : '/dashboard'}
                onClick={() => markRead(n.id)}
                className={`block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-2 ${n.read ? 'border-transparent' : 'border-brand-500 bg-brand-50/30 dark:bg-brand-900/10'}`}>
                <div className="text-sm font-medium capitalize">{n.type === 'invite' ? `Invited to ${n.payload?.tripTitle || 'a trip'}` : n.type}</div>
                <div className="text-xs text-slate-400 mt-0.5">{n.createdAt?.toDate ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'just now'}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
