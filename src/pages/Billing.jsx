import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { allInvoices } from '../data/patients'
import { formatCurrency, formatDate } from '../utils/format'
import '../styles/billing.css'

const statuses = [
  { slug: 'all', label: 'All' },
  { slug: 'paid', label: 'Paid' },
  { slug: 'pending', label: 'Pending' },
]

export default function Billing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') ?? 'all'
  const query = searchParams.get('q') ?? ''
  const [settled, setSettled] = useState([])

  const invoices = useMemo(() => allInvoices(), [])
  const isSettled = (invoice) => invoice.status === 'Paid' || settled.includes(invoice.id)

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return invoices
      .filter((invoice) => {
        const settledNow = invoice.status === 'Paid' || settled.includes(invoice.id)
        const statusOk =
          status === 'all'
            ? true
            : status === 'paid'
              ? settledNow
              : !settledNow
        const queryOk =
          term === '' ||
          [invoice.id, invoice.patientName, invoice.description, invoice.department]
            .join(' ')
            .toLowerCase()
            .includes(term)
        return statusOk && queryOk
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [invoices, status, query, settled])

  const totals = useMemo(() => {
    return invoices.reduce(
      (sum, invoice) => {
        sum.billed += invoice.amount
        const paid = invoice.status === 'Paid' || settled.includes(invoice.id)
        if (paid) sum.collected += invoice.amount
        else sum.pending += invoice.amount
        return sum
      },
      { billed: 0, collected: 0, pending: 0 },
    )
  }, [invoices, settled])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  return (
    <div className="page billing">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Revenue cycle</p>
          <h1>Billing</h1>
          <p className="page__sub">
            {visible.length} invoices across all departments. Open a patient record for their full
            statement.
          </p>
        </div>
        <div className="page__head-aside">
          <span className="pill-stat">
            Billed <strong>{formatCurrency(totals.billed)}</strong>
          </span>
          <span className="pill-stat pill-stat--success">
            Collected <strong>{formatCurrency(totals.collected)}</strong>
          </span>
          <span className="pill-stat pill-stat--warning">
            Outstanding <strong>{formatCurrency(totals.pending)}</strong>
          </span>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group" role="group" aria-label="Filter invoices by payment status">
          <span className="filter-group__label">Payment</span>
          <div className="filter-pills">
            {statuses.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={`filter-pill${status === item.slug ? ' is-active' : ''}`}
                onClick={() => updateParam('status', item.slug)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group--grow">
          <label className="search-field">
            <span className="sr-only">Search invoices</span>
            <input
              type="search"
              placeholder="Search by invoice, patient or description…"
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

      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Description</th>
              <th className="table__num">Amount</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visible.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <strong>{invoice.id}</strong>
                </td>
                <td>{formatDate(invoice.date)}</td>
                <td>
                  <Link className="table__link" to={`/patients/${invoice.patientId}/billing`}>
                    {invoice.patientName}
                  </Link>
                  <small className="table__sub">{invoice.department}</small>
                </td>
                <td>{invoice.description}</td>
                <td className="table__num">{formatCurrency(invoice.amount)}</td>
                <td>
                  <span className={`badge ${isSettled(invoice) ? 'badge--paid' : 'badge--pending'}`}>
                    {isSettled(invoice) ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="table__action">
                  {isSettled(invoice) ? (
                    <Link className="link-button" to={`/patients/${invoice.patientId}/billing`}>
                      statement
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--soft btn--sm"
                      onClick={() => setSettled((current) => [...current, invoice.id])}
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
              <td colSpan={4}>Showing {visible.length} invoices</td>
              <td className="table__num">
                {formatCurrency(visible.reduce((sum, invoice) => sum + invoice.amount, 0))}
              </td>
              <td colSpan={2}>of {formatCurrency(totals.billed)} billed</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <h2>No invoices found</h2>
          <p>Adjust the payment filter or clear the search to see more.</p>
          <button type="button" className="btn btn--primary" onClick={() => setSearchParams({})}>
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}