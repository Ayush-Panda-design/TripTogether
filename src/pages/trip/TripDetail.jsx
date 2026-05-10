import { useEffect, useState, useMemo } from 'react'
import { useParams, NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, Trash2, Settings } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { watchTrip, watchMembers, deleteTrip } from '../../features/trips/tripService'
import LoadingScreen from '../../components/ui/LoadingScreen'
import OverviewTab from '../../components/trip/OverviewTab.jsx'
import ItineraryTab from '../../components/trip/ItineraryTab.jsx'
import BudgetTab from '../../components/trip/BudgetTab.jsx'
import ChecklistsTab from '../../components/trip/ChecklistsTab.jsx'
import ReservationsTab from '../../components/trip/ReservationsTab.jsx'
import FilesTab from '../../components/trip/FilesTab.jsx'
import MembersTab from '../../components/trip/MembersTab.jsx'
import Avatar from '../../components/ui/Avatar'
import { daysBetween } from '../../utils/helpers'

const tabs = [
  { to: 'overview', label: 'Overview' },
  { to: 'itinerary', label: 'Itinerary' },
  { to: 'budget', label: 'Budget' },
  { to: 'checklists', label: 'Checklists' },
  { to: 'reservations', label: 'Reservations' },
  { to: 'files', label: 'Files' },
  { to: 'members', label: 'Members' },
]

export default function TripDetail() {
  const { tripId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [members, setMembers] = useState([])

  useEffect(() => watchTrip(tripId, setTrip), [tripId])
  useEffect(() => watchMembers(tripId, setMembers), [tripId])

  const me = useMemo(() => members.find((m) => m.uid === user?.uid), [members, user])
  const role = me?.role || 'viewer'
  const canEdit = role === 'owner' || role === 'editor'
  const isOwner = role === 'owner'

  if (!trip) return <LoadingScreen />

  const onDelete = async () => {
    if (!confirm('Delete this trip? This cannot be undone.')) return
    try { await deleteTrip(tripId); toast.success('Trip deleted'); navigate('/dashboard') }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card overflow-hidden">
        <div className="relative h-56 sm:h-64">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600'}
            alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 text-white">
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{trip.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/85">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{trip.destination}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />
                {trip.startDate && format(new Date(trip.startDate), 'MMM d')} – {trip.endDate && format(new Date(trip.endDate), 'MMM d, yyyy')}
                {' · '}{daysBetween(trip.startDate, trip.endDate)} days
              </span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{members.length} {members.length === 1 ? 'member' : 'members'}</span>
            </div>
          </div>
          {isOwner && (
            <button onClick={onDelete} className="absolute top-4 right-4 p-2 rounded-lg bg-black/40 text-white hover:bg-red-600 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="px-2 sm:px-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${isActive ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              {t.label}
            </NavLink>
          ))}
          <div className="ml-auto hidden sm:flex items-center -space-x-2 pr-2">
            {members.slice(0, 5).map((m) => <Avatar key={m.uid} name={m.name} src={m.avatar} size={28} />)}
            {members.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewTab trip={trip} members={members} />} />
        <Route path="itinerary" element={<ItineraryTab tripId={tripId} canEdit={canEdit} />} />
        <Route path="budget" element={<BudgetTab tripId={tripId} canEdit={canEdit} members={members} />} />
        <Route path="checklists" element={<ChecklistsTab tripId={tripId} canEdit={canEdit} members={members} />} />
        <Route path="reservations" element={<ReservationsTab tripId={tripId} canEdit={canEdit} />} />
        <Route path="files" element={<FilesTab tripId={tripId} canEdit={canEdit} />} />
        <Route path="members" element={<MembersTab tripId={tripId} members={members} isOwner={isOwner} />} />
      </Routes>
    </div>
  )
}
