import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PatientCard from '../../components/PatientCard'
import { patients, patientStatuses, statusLabels } from '../../data/patients'
import '../../styles/patients.css'

export default function Patients() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') ?? 'all'
  const query = searchParams.get('q') ?? ''

  const counts = useMemo(
    () =>
      patients.reduce((totals, patient) => {
        totals[patient.status] = (totals[patient.status] ?? 0) + 1
        return totals
      }, {}),
    [],
  )

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return patients.filter((patient) => {
      const matchesStatus = status === 'all' || patient.status === status
      const matchesQuery =
        term === '' ||
        [patient.name, patient.id, patient.diagnosis, patient.doctor, patient.department]
          .join(' ')
          .toLowerCase()
          .includes(term)
      return matchesStatus && matchesQuery
    })
  }, [status, query])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  return (
    <div className="page patients">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Patient records</p>
          <h1>Patients</h1>
          <p className="page__sub">
            {visible.length} of {patients.length} records shown. Filter by admission status or search
            by name, diagnosis or attending doctor.
          </p>
        </div>
        <div className="page__head-aside">
          <span className="pill-stat">
            Admitted <strong>{counts.admitted ?? 0}</strong>
          </span>
          <span className="pill-stat">
            Outpatient <strong>{counts.outpatient ?? 0}</strong>
          </span>
          <span className="pill-stat">
            Discharged <strong>{counts.discharged ?? 0}</strong>
          </span>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group" role="group" aria-label="Filter by status">
          <span className="filter-group__label">Status</span>
          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill${status === 'all' ? ' is-active' : ''}`}
              onClick={() => updateParam('status', 'all')}
            >
              All <span>{patients.length}</span>
            </button>
            {patientStatuses.map((value) => (
              <button
                key={value}
                type="button"
                className={`filter-pill${status === value ? ' is-active' : ''}`}
                onClick={() => updateParam('status', value)}
              >
                {statusLabels[value]} <span>{counts[value] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group--grow">
          <label className="search-field">
            <span className="sr-only">Search patients</span>
            <input
              type="search"
              placeholder="Search by name, ID, diagnosis or doctor…"
              value={query}
              onChange={(event) => updateParam('q', event.target.value)}
            />
          </label>
        </div>
      </div>

      {searchParams.toString() && (
        <p className="active-query">
          Active filters: <code>?{searchParams.toString()}</code>{' '}
          <button type="button" className="link-button" onClick={() => setSearchParams({})}>
            clear
          </button>
        </p>
      )}

      {visible.length > 0 ? (
        <div className="card-grid">
          {visible.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matching patients</h2>
          <p>
            Nothing matches {status !== 'all' ? `status “${statusLabels[status] ?? status}” ` : ''}
            {query && `search “${query}”`}.
          </p>
          <button type="button" className="btn btn--primary" onClick={() => setSearchParams({})}>
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}