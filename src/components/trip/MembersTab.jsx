import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '../ui/Avatar'
import { inviteMember, updateMemberRole, removeMember } from '../../features/trips/tripService'
import { UserPlus, Trash2 } from 'lucide-react'

export default function MembersTab({ tripId, members, isOwner }) {
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)

  const invite = async ({ email, role }) => {
    setLoading(true)
    try { await inviteMember(tripId, email, role); toast.success('Invited!'); reset() }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 card p-5">
        <h3 className="font-display text-lg font-semibold mb-3">Trip members</h3>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {members.map((m) => (
            <li key={m.uid} className="py-3 flex items-center gap-3">
              <Avatar name={m.name} src={m.avatar} size={40} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{m.name}</div>
                <div className="text-xs text-slate-500">{m.email}</div>
              </div>
              {isOwner && m.role !== 'owner' ? (
                <select value={m.role} onChange={(e) => updateMemberRole(tripId, m.uid, e.target.value)} className="input w-32 py-1.5 text-sm">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              ) : (
                <span className="chip bg-slate-100 dark:bg-slate-800 capitalize">{m.role}</span>
              )}
              {isOwner && m.role !== 'owner' && (
                <button onClick={() => removeMember(tripId, m.uid)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isOwner && (
        <form onSubmit={handleSubmit(invite)} className="card p-5 h-fit space-y-3">
          <h3 className="font-display font-semibold">Invite teammate</h3>
          <input type="email" className="input" placeholder="email@example.com" {...register('email', { required: true })} />
          <select className="input" {...register('role')}>
            <option value="editor">Editor — can modify everything</option>
            <option value="viewer">Viewer — read only</option>
          </select>
          <button disabled={loading} className="btn-primary w-full"><UserPlus className="w-4 h-4" /> {loading ? 'Inviting…' : 'Send invite'}</button>
          <p className="text-xs text-slate-400">User must already have a TripTogether account.</p>
        </form>
      )}
    </div>
  )
}
