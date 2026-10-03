import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPatientById, statusLabels } from '../../data/patients'
import { formatDate, initials } from '../../utils/format'
import '../../styles/patients.css'

export default function PatientHistory() {
  const { id } = useParams()
  const patient = getPatientById(id)
  const [filter, setFilter] = useState('all')

  if (!patient) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Patient not found</h2>
          <p>No record matches the ID “{id}”.</p>
          <Link className="btn btn--primary" to="/patients">
            Back to patients
          </Link>
        </div>
      </div>
    )
  }

  const entries = [...patient.history].sort((a, b) => b.date.localeCompare(a.date))
  const types = ['all', ...new Set(entries.map((entry) => entry.type))]
  const visible = filter === 'all' ? entries : entries.filter((entry) => entry.type === filter)

  return (
    <div className="page patient-history">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/patients">Patients</Link>
        <span>/</span>
        <Link to={`/patients/${patient.id}`}>{patient.id}</Link>
        <span>/</span>
        <span>History</span>
      </nav>

      <header className="page__head">
        <div className="patient-history__title">
          <span className="patient-hero__avatar patient-hero__avatar--sm" aria-hidden="true">
            {initials(patient.name)}
          </span>
          <div>
            <p className="page__eyebrow">Medical history</p>
            <h1>{patient.name}</h1>
            <p className="page__sub">
              {statusLabels[patient.status]} · {patient.department} · {entries.length} recorded
              events since {formatDate(entries[entries.length - 1]?.date)}
            </p>
          </div>
        </div>
        <div className="page__head-aside">
          <Link className="btn btn--ghost" to={`/patients/${patient.id}`}>
            Patient details
          </Link>
          <Link className="btn btn--primary" to={`/patients/${patient.id}/billing`}>
            Billing
          </Link>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group" role="group" aria-label="Filter history by type">
          <span className="filter-group__label">Event type</span>
          <div className="filter-pills">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-pill${filter === type ? ' is-active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ol className="timeline">
        {visible.map((entry) => (
          <li key={`${entry.date}-${entry.title}`} className="timeline__item">
            <span className="timeline__marker" aria-hidden="true" />
            <div className="timeline__content">
              <div className="timeline__head">
                <span className="timeline__date">{formatDate(entry.date)}</span>
                <span className={`badge badge--event badge--event-${slug(entry.type)}`}>
                  {entry.type}
                </span>
              </div>
              <h2>{entry.title}</h2>
              <p>{entry.notes}</p>
              <small className="timeline__doctor">{entry.doctor}</small>
            </div>
          </li>
        ))}
      </ol>

      {visible.length === 0 && (
        <div className="empty-state">
          <h2>No events of this type</h2>
          <p>Choose another event type to see the rest of the record.</p>
        </div>
      )}
    </div>
  )
}

function slug(value) {
  return value.toLowerCase().replace(/\s+/g, '-')
}