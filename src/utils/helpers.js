export const cn = (...c) => c.filter(Boolean).join(' ')

export const formatCurrency = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n || 0)

export const initials = (name = '') =>
  name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()

export const daysBetween = (a, b) => {
  if (!a || !b) return 0
  const ms = new Date(b).setHours(0,0,0,0) - new Date(a).setHours(0,0,0,0)
  return Math.max(0, Math.round(ms / 86400000) + 1)
}
