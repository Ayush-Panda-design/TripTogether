import { cn } from '../../utils/helpers'
export default function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800', className)} />
}
