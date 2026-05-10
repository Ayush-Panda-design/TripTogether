import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { Compass } from 'lucide-react'

export default function Login() {
  const { login, loginGoogle } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate(state?.from?.pathname || '/dashboard')
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  const google = async () => {
    try { await loginGoogle(); navigate('/dashboard') }
    catch (e) { toast.error(e.message) }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:block bg-gradient-to-br from-brand-600 to-violet-700 p-12 text-white relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="w-7 h-7" />
          <span className="font-display text-xl font-bold">TripTogether</span>
        </Link>
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="font-display text-4xl font-bold leading-tight">Plan trips that everyone actually shows up for.</h2>
          <p className="mt-4 text-white/80">Real-time itineraries, shared budgets, and the smoothest collab in travel.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to continue planning.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" {...register('email', { required: true })} />
              {errors.email && <p className="text-xs text-red-500 mt-1">Email required</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" {...register('password', { required: true, minLength: 6 })} />
              {errors.password && <p className="text-xs text-red-500 mt-1">Min 6 characters</p>}
            </div>
            <button disabled={loading} className="btn-primary w-full py-3">{loading ? 'Signing in…' : 'Sign in'}</button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" /> OR <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          <button onClick={google} className="btn-outline w-full py-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.32z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.1 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-center text-slate-500">
            Don't have an account? <Link to="/signup" className="text-brand-600 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
