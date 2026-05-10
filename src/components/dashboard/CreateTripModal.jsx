import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import { useAuth } from '../../context/AuthContext'
import { createTrip } from '../../features/trips/tripService'

export default function CreateTripModal({ open, onClose }) {
  const { user } = useAuth()
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const id = await createTrip(user, { ...data, visibility: data.visibility || 'private' })
      toast.success('Trip created!')
      reset(); onClose(); navigate(`/trips/${id}`)
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a new trip" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Trip title</label>
          <input className="input" placeholder="Tokyo Cherry Blossom Adventure" {...register('title', { required: true })} />
        </div>
        <div>
          <label className="label">Destination</label>
          <input className="input" placeholder="Tokyo, Japan" {...register('destination', { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start date</label>
            <input type="date" className="input" {...register('startDate', { required: true })} />
          </div>
          <div>
            <label className="label">End date</label>
            <input type="date" className="input" {...register('endDate', { required: true })} />
          </div>
        </div>
        <div>
          <label className="label">Cover image URL (optional)</label>
          <input className="input" placeholder="https://..." {...register('coverImage')} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea rows={3} className="input" {...register('description')} />
        </div>
        <div>
          <label className="label">Visibility</label>
          <select className="input" {...register('visibility')}>
            <option value="private">Private</option>
            <option value="public">Public (anyone with link)</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button disabled={loading} className="btn-primary">{loading ? 'Creating…' : 'Create trip'}</button>
        </div>
      </form>
    </Modal>
  )
}
