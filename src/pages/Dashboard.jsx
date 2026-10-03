import { Link } from 'react-router-dom'
import PatientCard from '../components/PatientCard'
import { allInvoices, countByStatus, departments, patients } from '../data/patients'
import { appointments, sortAppointments } from '../data/appointments'
import { categories, lowStockMedicines } from '../data/medicines'
import { formatCurrency, formatDate, formatLongDate } from '../utils/format'
import '../styles/dashboard.css'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard() {
  const counts = countByStatus()
  const invoices = allInvoices()
  const today = getToday()

  const scheduled = appointmentsForDay()
  const lowStock = lowStockMedicines()
  const admitted = patients.filter((patient) => patient.status === 'admitted')

  const revenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const outstanding = invoices
    .filter((invoice) => invoice.status !== 'Paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const departmentCounts = departments
    .map((department) => ({
      department,
      count: patients.filter((patient) => patient.department === department).length,
    }))
    .sort((a, b) => b.count - a.count)
  const maxDepartmentCount = Math.max(...departmentCounts.map((item) => item.count), 1)

  return (
    <div className="page dashboard">
      <section className="dashboard__hero">
        <div>
          <p className="dashboard__eyebrow">{formatLongDate(today)}</p>
          <h1>Good day, Dr. Obi</h1>
          <p className="dashboard__lede">
            {admitted.length} patients are on the ward, {scheduled.length} appointments need attention,
            and {lowStock.length} medicine lines need reordering.
          </p>
          <div className="dashboard__hero-actions">
            <Link className="btn btn--primary" to="/patients?status=admitted">
              View admitted patients
            </Link>
            <Link className="btn btn--ghost" to="/appointments">
              Open schedule
            </Link>
          </div>
        </div>
        <div className="dashboard__hero-badge">
          <span>Accreditation</span>
          <strong>NHAB</strong>
          <small>Platinum · 2026</small>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-card__label">Total patients</span>
          <strong className="stat-card__value">{patients.length}</strong>
          <span className="stat-card__hint">Across {departments.length} departments</span>
        </article>
        <article className="stat-card stat-card--accent">
          <span className="stat-card__label">Admitted</span>
          <strong className="stat-card__value">{counts.admitted}</strong>
          <span className="stat-card__hint">{counts.discharged} discharged so far</span>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">Appointments</span>
          <strong className="stat-card__value">{scheduled.length}</strong>
          <span className="stat-card__hint">Today or next on the list</span>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">Billed</span>
          <strong className="stat-card__value">{formatCurrency(revenue)}</strong>
          <span className="stat-card__hint">{formatCurrency(outstanding)} outstanding</span>
        </article>
        <article className="stat-card stat-card--warning">
          <span className="stat-card__label">Low stock</span>
          <strong className="stat-card__value">{lowStock.length}</strong>
          <span className="stat-card__hint">Lines below reorder level</span>
        </article>
      </section>

      <section className="dashboard__columns">
        <div className="card">
          <header className="card__head">
            <h2>Upcoming schedule</h2>
            <Link className="link-arrow" to="/appointments">
              All appointments
            </Link>
          </header>
          <ul className="schedule-list">
            {scheduled.map((appointment) => (
              <li key={appointment.id} className="schedule-item">
                <span className="schedule-item__time">
                  <strong>{appointment.time}</strong>
                  <small>{formatDate(appointment.date)}</small>
                </span>
                <span className="schedule-item__body">
                  <strong>{appointment.patientName}</strong>
                  <small>
                    {appointment.type} · {appointment.department} · {appointment.doctor}
                  </small>
                </span>
                <span className="badge badge--scheduled">{appointment.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <header className="card__head">
            <h2>Ward occupancy</h2>
            <Link className="link-arrow" to="/patients?status=admitted">
              Manage
            </Link>
          </header>
          <ul className="bar-list">
            {departmentCounts.map((item) => (
              <li key={item.department}>
                <span className="bar-list__label">
                  {item.department}
                  <small>{item.count} patient{item.count === 1 ? '' : 's'}</small>
                </span>
                <span className="bar-list__track">
                  <span
                    className="bar-list__fill"
                    style={{ width: `${(item.count / maxDepartmentCount) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dashboard__section">
        <header className="section-head">
          <h2>Patients currently admitted</h2>
          <Link className="link-arrow" to="/patients?status=admitted">
            See all {admitted.length}
          </Link>
        </header>
        <div className="card-grid">
          {admitted.slice(0, 3).map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </section>

      <section className="dashboard__columns">
        <div className="card">
          <header className="card__head">
            <h2>Pharmacy alerts</h2>
            <Link className="link-arrow" to="/pharmacy">
              Inventory
            </Link>
          </header>
          <ul className="alert-list">
            {lowStock.slice(0, 5).map((medicine) => (
              <li key={medicine.id}>
                <span>
                  <strong>{medicine.name}</strong>
                  <small>
                    {medicine.stock} {medicine.unit} left · reorder at {medicine.reorderLevel}
                  </small>
                </span>
                <Link
                  className="btn btn--soft btn--sm"
                  to={`/pharmacy?category=${medicine.category}`}
                >
                  {categories.find((item) => item.slug === medicine.category)?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <header className="card__head">
            <h2>Patient mix</h2>
            <Link className="link-arrow" to="/patients">
              Directory
            </Link>
          </header>
          <ul className="mix-list">
            <li>
              <span className="badge badge--admitted">Admitted</span>
              <strong>{counts.admitted}</strong>
            </li>
            <li>
              <span className="badge badge--outpatient">Outpatient</span>
              <strong>{counts.outpatient}</strong>
            </li>
            <li>
              <span className="badge badge--discharged">Discharged</span>
              <strong>{counts.discharged}</strong>
            </li>
          </ul>
          <p className="card__footnote">
            {outstanding > 0
              ? `${formatCurrency(outstanding)} is awaiting payment across ${invoices.filter((invoice) => invoice.status !== 'Paid').length} invoices.`
              : 'All invoices have been settled.'}
          </p>
        </div>
      </section>
    </div>
  )
}

function appointmentsForDay() {
  const today = getToday()
  const upcoming = appointments.filter(
    (appointment) => appointment.status === 'Scheduled' && appointment.date >= today,
  )
  return sortAppointments(upcoming).slice(0, 6)
}