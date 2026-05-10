import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { daysBetween } from '../../utils/helpers'

const fallbackCovers = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=800',
]

export default function TripCard({ trip }) {
  const cover = trip.coverImage || fallbackCovers[trip.id?.charCodeAt(0) % fallbackCovers.length]
  const dur = daysBetween(trip.startDate, trip.endDate)
  return (
    <Link to={`/trips/${trip.id}`}>
      <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group cursor-pointer">
        <div className="relative h-44 overflow-hidden">
          <img src={cover} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="font-display font-bold text-lg leading-tight">{trip.title}</h3>
            <div className="flex items-center gap-1 text-xs text-white/80 mt-0.5">
              <MapPin className="w-3 h-3" /> {trip.destination}
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4" />
            {trip.startDate ? format(new Date(trip.startDate), 'MMM d') : '—'}
            {dur > 1 ? ` · ${dur}d` : ''}
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Users className="w-4 h-4" /> {(trip.memberIds || []).length}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
