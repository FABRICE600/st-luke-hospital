import { Link, useParams } from 'react-router-dom'
import { appointmentsForPatient } from '../../data/appointments'
import { getPatientById, patientInvoiceTotals, statusLabels } from '../../data/patients'
import { formatCurrency, formatDate, initials } from '../../utils/format'
import '../../styles/patients.css'

const vitalLabels = {
  heartRate: 'Heart rate',
  bloodPressure: 'Blood pressure',
  temperature: 'Temperature',
  spo2: 'SpO₂',
  weight: 'Weight',
}

const vitalUnits = {
  heartRate: 'bpm',
  temperature: '°C',
  spo2: '%',
  weight: 'kg',
}

export default function PatientDetails() {
  const { id } = useParams()
  const patient = getPatientById(id)

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

  const totals = patientInvoiceTotals(patient.id)
  const visits = appointmentsForPatient(patient.id)
  const isOutpatient = patient.status === 'outpatient'

  return (
    <div className="page patient-details">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/patients">Patients</Link>
        <span>/</span>
        <span>{patient.id}</span>
      </nav>

      <header className="patient-hero">
        <span className="patient-hero__avatar" aria-hidden="true">
          {initials(patient.name)}
        </span>
        <div className="patient-hero__body">
          <div className="patient-hero__title">
            <h1>{patient.name}</h1>
            <span className={`badge badge--${patient.status}`}>
              {statusLabels[patient.status]}
            </span>
          </div>
          <p className="patient-hero__meta">
            {patient.id} · {patient.age} years · {patient.gender} · {patient.bloodGroup} ·{' '}
            {patient.phone}
          </p>
          <p className="patient-hero__diagnosis">{patient.diagnosis}</p>
        </div>
        <div className="patient-hero__actions">
          <Link className="btn btn--ghost" to={`/patients/${patient.id}/history`}>
            Medical history
          </Link>
          <Link className="btn btn--primary" to={`/patients/${patient.id}/billing`}>
            Billing · {formatCurrency(totals.pending)} due
          </Link>
        </div>
      </header>

      <section className="detail-grid">
        <div className="card">
          <header className="card__head">
            <h2>Vitals</h2>
            <small className="card__hint">Last recorded on admission review</small>
          </header>
          <ul className="vital-grid">
            {Object.entries(patient.vitals).map(([key, value]) => (
              <li key={key}>
                <span>{vitalLabels[key] ?? key}</span>
                <strong>
                  {value}
                  {vitalUnits[key] && <small>{vitalUnits[key]}</small>}
                </strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <header className="card__head">
            <h2>Admission</h2>
          </header>
          <dl className="info-list">
            <div>
              <dt>Department</dt>
              <dd>{patient.department}</dd>
            </div>
            <div>
              <dt>Attending doctor</dt>
              <dd>{patient.doctor}</dd>
            </div>
            <div>
              <dt>Ward / bed</dt>
              <dd>{isOutpatient ? 'Not admitted' : `${patient.ward} · Bed ${patient.bed}`}</dd>
            </div>
            <div>
              <dt>Admitted on</dt>
              <dd>{formatDate(patient.admittedOn)}</dd>
            </div>
            <div>
              <dt>Discharge date</dt>
              <dd>{formatDate(patient.dischargeDate)}</dd>
            </div>
            <div>
              <dt>Allergies</dt>
              <dd>
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy) => (
                    <span key={allergy} className="badge badge--allergy">
                      {allergy}
                    </span>
                  ))
                ) : (
                  'None recorded'
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <header className="card__head">
            <h2>Contact & cover</h2>
          </header>
          <dl className="info-list">
            <div>
              <dt>Phone</dt>
              <dd>{patient.phone}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{patient.email}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{patient.address}</dd>
            </div>
            <div>
              <dt>Insurance</dt>
              <dd>
                {patient.insurance} <small>({patient.policyNumber})</small>
              </dd>
            </div>
            <div>
              <dt>Billed to date</dt>
              <dd>{formatCurrency(totals.total)}</dd>
            </div>
            <div>
              <dt>Outstanding</dt>
              <dd className={totals.pending > 0 ? 'text-warning' : 'text-success'}>
                {formatCurrency(totals.pending)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <header className="card__head">
            <h2>Appointments</h2>
            <Link className="link-arrow" to="/appointments">
              Schedule
            </Link>
          </header>
          {visits.length > 0 ? (
            <ul className="mini-list">
              {visits.map((visit) => (
                <li key={visit.id}>
                  <span>
                    <strong>{formatDate(visit.date)} · {visit.time}</strong>
                    <small>
                      {visit.type} — {visit.doctor}
                    </small>
                  </span>
                  <span className={`badge badge--${visit.status.toLowerCase()}`}>{visit.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card__empty">No appointments recorded for this patient.</p>
          )}
        </div>
      </section>
    </div>
  )
}