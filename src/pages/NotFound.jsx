import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-7xl font-bold bg-gradient-to-tr from-brand-600 to-violet-600 bg-clip-text text-transparent">404</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">This page wandered off the map.</p>
      <Link to="/dashboard" className="btn-primary mt-6">Back to dashboard</Link>
    </div>
  )
}
