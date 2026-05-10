import { Loader2 } from 'lucide-react'
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
    </div>
  )
}
