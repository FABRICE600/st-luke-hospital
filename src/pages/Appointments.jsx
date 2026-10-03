import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  appointmentStatuses,
  appointmentTypes,
  appointments as seedAppointments,
  nextAppointmentId,
  slots,
  sortAppointments,
} from '../data/appointments'
import { doctors, patients } from '../data/patients'
import { formatCurrency, formatDate } from '../utils/format'
import '../styles/appointments.css'

const emptyForm = {
  patientId: '',
  date: '',
  time: slots[0],
  type: appointmentTypes[0],
  doctor: doctors[0].name,
  reason: '',
}

export default function Appointments() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') ?? 'all'
  const [items, setItems] = useState(seedAppointments)
  const [form, setForm] = useState(emptyForm)
  const [notice, setNotice] = useState('')

  const visible = useMemo(
    () =>
      sortAppointments(
        items.filter((item) => status === 'all' || item.status === status),
      ),
    [items, status],
  )

  const grouped = useMemo(() => {
    return visible.reduce((groups, item) => {
      const list = groups.get(item.date) ?? []
      list.push(item)
      groups.set(item.date, list)
      return groups
    }, new Map())
  }, [visible])

  const counts = useMemo(() => {
    return items.reduce((totals, item) => {
      totals[item.status] = (totals[item.status] ?? 0) + 1
      return totals
    }, {})
  }, [items])

  function updateStatusFilter(value) {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('status')
    else next.set('status', value)
    setSearchParams(next)
  }

  function changeStatus(id, nextStatus) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)),
    )
  }

  function submitBooking(event) {
    event.preventDefault()
    if (!form.patientId || !form.date) {
      setNotice('Choose a patient and a date before booking.')
      return
    }
    const patient = patients.find((item) => item.id === form.patientId)
    setItems((current) => [
      ...current,
      {
        id: nextAppointmentId(items),
        patientId: patient.id,
        patientName: patient.name,
        doctor: form.doctor,
        department: patient.department,
        date: form.date,
        time: form.time,
        type: form.type,
        status: 'Scheduled',
        reason: form.reason || 'General consultation',
        fee: 5000,
      },
    ])
    setForm(emptyForm)
    setNotice(`Appointment booked for ${patient.name}.`)
  }

  return (
    <div className="page appointments">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Front desk</p>
          <h1>Appointments</h1>
          <p className="page__sub">
            {visible.length} of {items.length} appointments listed. Use the status filters or the
            booking form to add a new slot.
          </p>
        </div>
        <div className="page__head-aside">
          <span className="pill-stat">
            Scheduled <strong>{counts.Scheduled ?? 0}</strong>
          </span>
          <span className="pill-stat">
            Completed <strong>{counts.Completed ?? 0}</strong>
          </span>
          <span className="pill-stat">
            Cancelled <strong>{counts.Cancelled ?? 0}</strong>
          </span>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group" role="group" aria-label="Filter appointments by status">
          <span className="filter-group__label">Status</span>
          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill${status === 'all' ? ' is-active' : ''}`}
              onClick={() => updateStatusFilter('all')}
            >
              All <span>{items.length}</span>
            </button>
            {appointmentStatuses.map((value) => (
              <button
                key={value}
                type="button"
                className={`filter-pill${status === value ? ' is-active' : ''}`}
                onClick={() => updateStatusFilter(value)}
              >
                {value} <span>{counts[value] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="appointments__layout">
        <section className="appointments__list">
          {[...grouped.entries()].map(([date, dayItems]) => (
            <article key={date} className="card day-group">
              <header className="card__head">
                <h2>{formatDate(date)}</h2>
                <small className="card__hint">
                  {dayItems.length} appointment{dayItems.length === 1 ? '' : 's'}
                </small>
              </header>
              <ul className="appointment-list">
                {dayItems.map((appointment) => (
                  <li key={appointment.id} className="appointment-row">
                    <span className="appointment-row__time">{appointment.time}</span>
                    <span className="appointment-row__body">
                      <strong>
                        <Link to={`/patients/${appointment.patientId}`}>
                          {appointment.patientName}
                        </Link>
                      </strong>
                      <small>
                        {appointment.type} · {appointment.reason}
                      </small>
                      <small className="appointment-row__doctor">
                        {appointment.doctor} · {appointment.department} ·{' '}
                        {formatCurrency(appointment.fee)}
                      </small>
                    </span>
                    <span className="appointment-row__meta">
                      <span className={`badge badge--${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'Scheduled' && (
                        <span className="appointment-row__actions">
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => changeStatus(appointment.id, 'Completed')}
                          >
                            complete
                          </button>
                          <button
                            type="button"
                            className="link-button link-button--danger"
                            onClick={() => changeStatus(appointment.id, 'Cancelled')}
                          >
                            cancel
                          </button>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {visible.length === 0 && (
            <div className="empty-state">
              <h2>No appointments here</h2>
              <p>No appointment matches the “{status}” filter.</p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => updateStatusFilter('all')}
              >
                Show all appointments
              </button>
            </div>
          )}
        </section>

        <aside className="appointments__aside">
          <form className="card booking-form" onSubmit={submitBooking}>
            <header className="card__head">
              <h2>Book appointment</h2>
            </header>

            <label className="field">
              <span>Patient</span>
              <select
                value={form.patientId}
                onChange={(event) => setForm({ ...form, patientId: event.target.value })}
              >
                <option value="">Select patient…</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Slot</span>
                <select
                  value={form.time}
                  onChange={(event) => setForm({ ...form, time: event.target.value })}
                >
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Type</span>
                <select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Doctor</span>
              <select
                value={form.doctor}
                onChange={(event) => setForm({ ...form, doctor: event.target.value })}
              >
                {doctors.map((doctor) => (
                  <option key={doctor.name} value={doctor.name}>
                    {doctor.name} — {doctor.specialty}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Reason</span>
              <textarea
                rows="3"
                placeholder="Reason for visit"
                value={form.reason}
                onChange={(event) => setForm({ ...form, reason: event.target.value })}
              />
            </label>

            <button type="submit" className="btn btn--primary btn--block">
              Book appointment
            </button>
            {notice && <p className="form-notice">{notice}</p>}
          </form>
        </aside>
      </div>
    </div>
  )
}