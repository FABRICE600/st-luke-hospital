import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPatientById, getPatientInvoices } from '../../data/patients'
import { formatCurrency, formatDate, initials } from '../../utils/format'
import '../../styles/billing.css'

export default function PatientBilling() {
  const { id } = useParams()
  const patient = getPatientById(id)
  const [paid, setPaid] = useState(() =>
    getPatientInvoices(id)
      .filter((invoice) => invoice.status !== 'Paid')
      .map((invoice) => invoice.id),
  )

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

  const invoices = patient.invoices
  const isSettled = (invoice) => invoice.status === 'Paid' || paid.includes(invoice.id)
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const collected = invoices
    .filter(isSettled)
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const outstanding = total - collected

  return (
    <div className="page patient-billing">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/patients">Patients</Link>
        <span>/</span>
        <Link to={`/patients/${patient.id}`}>{patient.id}</Link>
        <span>/</span>
        <span>Billing</span>
      </nav>

      <header className="page__head">
        <div className="patient-history__title">
          <span className="patient-hero__avatar patient-hero__avatar--sm" aria-hidden="true">
            {initials(patient.name)}
          </span>
          <div>
            <p className="page__eyebrow">Patient billing</p>
            <h1>{patient.name}</h1>
            <p className="page__sub">
              {patient.insurance} · policy {patient.policyNumber} · {invoices.length} invoices
            </p>
          </div>
        </div>
        <div className="page__head-aside">
          <Link className="btn btn--ghost" to={`/patients/${patient.id}`}>
            Details
          </Link>
          <Link className="btn btn--ghost" to={`/patients/${patient.id}/history`}>
            History
          </Link>
          <Link className="btn btn--ghost" to="/billing">
            All billing
          </Link>
        </div>
      </header>

      <section className="summary-grid">
        <article className="card card--stat">
          <span>Total billed</span>
          <strong>{formatCurrency(total)}</strong>
        </article>
        <article className="card card--stat card--stat--success">
          <span>Collected</span>
          <strong>{formatCurrency(collected)}</strong>
        </article>
        <article className="card card--stat card--stat--warning">
          <span>Outstanding</span>
          <strong>{formatCurrency(outstanding)}</strong>
        </article>
      </section>

      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Description</th>
              <th className="table__num">Qty</th>
              <th className="table__num">Amount</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <strong>{invoice.id}</strong>
                </td>
                <td>{formatDate(invoice.date)}</td>
                <td>{invoice.description}</td>
                <td className="table__num">{invoice.qty}</td>
                <td className="table__num">{formatCurrency(invoice.amount)}</td>
                <td>
                  <span className={`badge ${isSettled(invoice) ? 'badge--paid' : 'badge--pending'}`}>
                    {isSettled(invoice) ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="table__action">
                  {isSettled(invoice) ? (
                    <small className="text-success">Settled</small>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--soft btn--sm"
                      onClick={() => setPaid((current) => [...current, invoice.id])}
                    >
                      Mark paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Totals</td>
              <td className="table__num">{formatCurrency(total)}</td>
              <td colSpan={2}>{formatCurrency(outstanding)} outstanding</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}