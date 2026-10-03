import { Link } from 'react-router-dom'
import '../styles/footer.css'

const quickLinks = [
  { to: '/patients?status=admitted', label: 'Admitted patients' },
  { to: '/patients?status=outpatient', label: 'Outpatient list' },
  { to: '/appointments', label: 'Today’s schedule' },
  { to: '/pharmacy?category=antibiotics', label: 'Pharmacy stock' },
]

const contact = [
  { label: 'Emergency', value: '+234 800 555 0112' },
  { label: 'Reception', value: '+234 800 555 0148' },
  { label: 'Email', value: 'care@stlukehospital.org' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__column">
          <div className="footer__brand">
            <img src="/images/hospital-logo.png" alt="" className="footer__logo" />
            <div>
              <strong>St. Luke General Hospital</strong>
              <p>18 Covenant Way, Lekki Phase 1, Lagos</p>
            </div>
          </div>
          <p className="footer__text">
            A 320-bed teaching hospital delivering primary, secondary and specialist care
            since 1974. Accredited by the National Hospital Accreditation Board.
          </p>
        </div>

        <div className="footer__column">
          <h4>Quick links</h4>
          <ul className="footer__list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__column">
          <h4>Contact</h4>
          <ul className="footer__list footer__list--contact">
            {contact.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__column">
          <h4>Departments</h4>
          <ul className="footer__list">
            <li>Cardiology</li>
            <li>Orthopaedics</li>
            <li>Paediatrics</li>
            <li>General Medicine</li>
            <li>Neurology</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bar">
        <span>© 2026 St. Luke General Hospital. All rights reserved.</span>
        <span className="footer__bar-links">
          <Link to="/">Privacy</Link>
          <Link to="/">Records policy</Link>
          <Link to="/">Patient charter</Link>
        </span>
      </div>
    </footer>
  )
}