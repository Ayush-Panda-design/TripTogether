import { Link, useLocation } from 'react-router-dom'
import { Home, Map, User, LogOut, ChevronLeft, ChevronRight, Compass } from 'lucide-react'
import { useUIStore } from '../../lib/store'
import { useAuth } from '../../context/AuthContext'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { logout, profile } = useAuth()
  const { pathname } = useLocation()
  const open = sidebarOpen

  return (
    <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col glass border-r border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 ${open ? 'w-64' : 'w-20'}`}>
      <div className="h-16 flex items-center px-5 gap-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-violet-500 flex items-center justify-center text-white">
          <Compass className="w-5 h-5" />
        </div>
        {open && <span className="font-display text-lg font-bold">TripTogether</span>}
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to)
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <Icon className="w-5 h-5 shrink-0" />
              {open && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
          <LogOut className="w-5 h-5 shrink-0" />{open && 'Logout'}
        </button>
        <button onClick={toggleSidebar} className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}
