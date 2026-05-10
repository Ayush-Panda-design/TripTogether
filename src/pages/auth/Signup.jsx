import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { Compass } from 'lucide-react'

export default function Signup() {
  const { signup, loginGoogle } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async ({ name, email, password }) => {
    setLoading(true)
    try {
      await signup(email, password, name)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center justify-center p-8 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Start planning your next adventure.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" {...register('email', { required: true })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" {...register('password', { required: true, minLength: 6 })} />
              {errors.password && <p className="text-xs text-red-500 mt-1">Min 6 characters</p>}
            </div>
            <button disabled={loading} className="btn-primary w-full py-3">{loading ? 'Creating…' : 'Create account'}</button>
          </form>

          <button onClick={loginGoogle} className="btn-outline w-full py-3 mt-3">Continue with Google</button>

          <p className="mt-6 text-sm text-center text-slate-500">
            Already have an account? <Link to="/login" className="text-brand-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block bg-gradient-to-br from-violet-600 to-brand-700 p-12 text-white relative overflow-hidden order-1 lg:order-2">
        <div className="flex items-center gap-2 justify-end">
          <span className="font-display text-xl font-bold">TripTogether</span>
          <Compass className="w-7 h-7" />
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="font-display text-4xl font-bold">Where will you go next?</h2>
          <p className="mt-4 text-white/80">Free forever for small crews. No card required.</p>
        </div>
      </div>
    </div>
  )
}
