import { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { Plus, Trash2, Wallet } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import EmptyState from '../ui/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/helpers'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']
const cats = ['food', 'transport', 'lodging', 'activity', 'shopping', 'other']

export default function BudgetTab({ tripId, canEdit, members }) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    const q = query(collection(db, 'trips', tripId, 'expenses'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (s) => setExpenses(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [tripId])

  const add = async (data) => {
    await addDoc(collection(db, 'trips', tripId, 'expenses'), {
      ...data, amount: Number(data.amount), paidBy: user.uid,
      splitBetween: members.map((m) => m.uid), createdAt: serverTimestamp(),
    })
    reset()
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const perPerson = members.length ? total / members.length : 0
  const byCat = cats.map((c) => ({
    name: c, value: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0)
  })).filter(d => d.value > 0)
  const byMember = members.map((m) => ({
    name: m.name?.split(' ')[0] || 'You',
    spent: expenses.filter(e => e.paidBy === m.uid).reduce((s, e) => s + e.amount, 0),
  }))

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5"><div className="text-xs text-slate-500">Total spent</div><div className="text-2xl font-display font-bold">{formatCurrency(total)}</div></div>
          <div className="card p-5"><div className="text-xs text-slate-500">Per person</div><div className="text-2xl font-display font-bold">{formatCurrency(perPerson)}</div></div>
          <div className="card p-5"><div className="text-xs text-slate-500">Expenses</div><div className="text-2xl font-display font-bold">{expenses.length}</div></div>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-3">Spending by category</h3>
          {byCat.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-3">Who paid what</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byMember}>
              <XAxis dataKey="name" /><YAxis /><Tooltip />
              <Bar dataKey="spent" fill="#3b82f6" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold mb-3">Expenses</h3>
          {expenses.length === 0 ? <EmptyState icon={Wallet} title="No expenses yet" description="Add your first expense to start tracking." />
          : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {expenses.map((e) => (
                <li key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-slate-500 capitalize">{e.category} · paid by {members.find(m => m.uid === e.paidBy)?.name || 'someone'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-display font-semibold">{formatCurrency(e.amount, e.currency)}</div>
                    {canEdit && <button onClick={() => deleteDoc(doc(db, 'trips', tripId, 'expenses', e.id))} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {canEdit && (
        <form onSubmit={handleSubmit(add)} className="card p-5 h-fit space-y-3 sticky top-20">
          <h3 className="font-display font-semibold">Add expense</h3>
          <input className="input" placeholder="Title" {...register('title', { required: true })} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" step="0.01" className="input" placeholder="Amount" {...register('amount', { required: true })} />
            <select className="input" {...register('currency')}><option>USD</option><option>EUR</option><option>JPY</option><option>GBP</option><option>INR</option></select>
          </div>
          <select className="input" {...register('category')}>
            {cats.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
          <button className="btn-primary w-full"><Plus className="w-4 h-4" /> Add expense</button>
        </form>
      )}
    </div>
  )
}
