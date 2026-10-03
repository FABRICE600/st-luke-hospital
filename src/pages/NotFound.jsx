import { Link, useLocation } from 'react-router-dom'
import '../styles/notfound.css'

const suggestions = [
  { to: '/', label: 'Dashboard', detail: 'Ward overview and today’s figures' },
  { to: '/patients', label: 'Patients', detail: 'Directory, filters and records' },
  { to: '/appointments', label: 'Appointments', detail: 'Schedule and booking desk' },
  { to: '/billing', label: 'Billing', detail: 'Invoices and payments' },
  { to: '/pharmacy', label: 'Pharmacy', detail: 'Stock levels by category' },
]

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="page notfound">
      <span className="notfound__code">404</span>
      <h1>We could not find that ward</h1>
      <p className="notfound__lede">
        Nothing is registered at <code>{location.pathname}</code>. The page may have been moved, or the
        link may be mistyped.
      </p>

      <div className="notfound__links">
        {suggestions.map((item) => (
          <Link key={item.to} to={item.to} className="notfound__link">
            <strong>{item.label}</strong>
            <small>{item.detail}</small>
          </Link>
        ))}
      </div>

      <Link className="btn btn--primary" to="/">
        Back to dashboard
      </Link>
    </div>
  )
}