import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { useUIStore } from '../../lib/store'

export default function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
