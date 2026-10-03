const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function toDate(value) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatCurrency(value) {
  return currencyFormatter.format(value ?? 0)
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-NG').format(value ?? 0)
}

export function formatDate(value) {
  const date = toDate(value)
  return date ? dateFormatter.format(date) : '—'
}

export function formatLongDate(value) {
  const date = toDate(value)
  return date ? longDateFormatter.format(date) : '—'
}

export function daysBetween(from, to) {
  const start = toDate(from)
  const end = toDate(to)
  if (!start || !end) return 0
  return Math.max(0, Math.round((end - start) / 86400000))
}

export function initials(name = '') {
  return name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function slugify(value = '') {
  return value.toLowerCase().replace(/\s+/g, '-')
}

export function titleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}