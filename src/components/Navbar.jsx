import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/navbar.css'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/patients', label: 'Patients' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/billing', label: 'Billing' },
  { to: '/pharmacy', label: 'Pharmacy' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img src="/images/hospital-logo.png" alt="" className="navbar__logo" />
          <span className="navbar__brand-text">
            <strong>St. Luke</strong>
            <small>General Hospital</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links${open ? ' is-open' : ''}`} aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className="navbar__emergency">24/7 Emergency</span>
        </nav>

        <div className="navbar__profile">
          <img src="/images/doctor.jpg" alt="Dr. Emeka Obi" className="navbar__avatar" />
          <span className="navbar__profile-text">
            <strong>Dr. Emeka Obi</strong>
            <small>Cardiologist</small>
          </span>
        </div>
      </div>
    </header>
  )
}