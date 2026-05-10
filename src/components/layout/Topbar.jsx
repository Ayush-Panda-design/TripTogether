import { Bell, Moon, Sun, Search, Menu } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import NotificationsDropdown from '../../features/notifications/NotificationsDropdown.jsx'
import { Link } from 'react-router-dom'
import { useUIStore } from '../../lib/store'

export default function Topbar() {
  const { theme, toggle } = useTheme()
  const { profile } = useAuth()
  const { toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-6 flex items-center gap-3">
      <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search trips, places, people..." className="input pl-9 h-10 text-sm" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={toggle} className="btn-ghost p-2" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <NotificationsDropdown />
        <Link to="/profile" className="ml-1">
          <Avatar name={profile?.name} src={profile?.avatar} size={36} />
        </Link>
      </div>
    </header>
  )
}
