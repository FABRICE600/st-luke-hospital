import { Link } from 'react-router-dom'
import { statusLabels } from '../data/patients'
import { formatDate, initials } from '../utils/format'
import '../styles/patients.css'

export default function PatientCard({ patient }) {
  return (
    <article className="patient-card">
      <header className="patient-card__head">
        <span className="patient-card__avatar" aria-hidden="true">
          {initials(patient.name)}
        </span>
        <div className="patient-card__id-block">
          <h3 className="patient-card__name">
            <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
          </h3>
          <span className="patient-card__meta">
            {patient.id} · {patient.age} yrs · {patient.gender}
          </span>
        </div>
        <span className={`badge badge--${patient.status}`}>{statusLabels[patient.status]}</span>
      </header>

      <dl className="patient-card__facts">
        <div>
          <dt>Diagnosis</dt>
          <dd>{patient.diagnosis}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{patient.department}</dd>
        </div>
        <div>
          <dt>Attending</dt>
          <dd>{patient.doctor}</dd>
        </div>
        <div>
          <dt>Blood group</dt>
          <dd>{patient.bloodGroup}</dd>
        </div>
      </dl>

      <footer className="patient-card__foot">
        <span className="patient-card__stay">
          {patient.status === 'outpatient'
            ? `Visit since ${formatDate(patient.history[patient.history.length - 1].date)}`
            : `${patient.ward} · Bed ${patient.bed}`}
        </span>
        <div className="patient-card__actions">
          <Link className="btn btn--ghost btn--sm" to={`/patients/${patient.id}`}>
            Details
          </Link>
          <Link className="btn btn--ghost btn--sm" to={`/patients/${patient.id}/history`}>
            History
          </Link>
          <Link className="btn btn--primary btn--sm" to={`/patients/${patient.id}/billing`}>
            Billing
          </Link>
        </div>
      </footer>
    </article>
  )
}