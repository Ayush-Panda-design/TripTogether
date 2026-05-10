import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Users, Calendar, Wallet, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-violet-500 flex items-center justify-center text-white">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-display text-xl font-bold">TripTogether</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/signup" className="btn-primary">Get started <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
          Plan unforgettable trips,<br />
          <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">together.</span>
        </motion.h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Collaborative itineraries, shared budgets, real-time updates, and beautiful checklists — everything your crew needs in one place.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/signup" className="btn-primary px-6 py-3 text-base">Start planning free</Link>
          <Link to="/login" className="btn-outline px-6 py-3 text-base">I have an account</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, title: 'Itinerary builder', desc: 'Drag & drop activities day-by-day.' },
          { icon: Users, title: 'Real-time collab', desc: 'Plan with friends, live.' },
          { icon: Wallet, title: 'Budget tracking', desc: 'Split expenses fairly.' },
          { icon: Compass, title: 'Reservations', desc: 'Flights, hotels, dinners — organized.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6">
            <Icon className="w-8 h-8 text-brand-600" />
            <h3 className="mt-4 font-display font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
