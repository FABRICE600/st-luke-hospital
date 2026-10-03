import { stockLevel } from '../data/medicines'
import { formatCurrency, formatDate, slugify } from '../utils/format'
import '../styles/pharmacy.css'

const stockLabels = {
  ok: 'In stock',
  low: 'Low stock',
  out: 'Out of stock',
}

export default function PharmacyCard({ medicine, onRestock }) {
  const level = stockLevel(medicine)
  const percentage = Math.min(100, Math.round((medicine.stock / (medicine.reorderLevel * 2)) * 100))

  return (
    <article className="pharmacy-card">
      <header className="pharmacy-card__head">
        <span className={`pharmacy-card__pill pharmacy-card__pill--${slugify(medicine.category)}`}>
          {medicine.strength}
        </span>
        <span className={`stock stock--${level}`}>{stockLabels[level]}</span>
      </header>

      <h3 className="pharmacy-card__name">{medicine.name}</h3>
      <p className="pharmacy-card__generic">{medicine.generic}</p>

      <div className="pharmacy-card__bar" aria-hidden="true">
        <span className={`pharmacy-card__bar-fill pharmacy-card__bar-fill--${level}`} style={{ width: `${percentage}%` }} />
      </div>

      <div className="pharmacy-card__stock">
        <strong>{medicine.stock}</strong> {medicine.unit} on hand
        <small>Reorder at {medicine.reorderLevel}</small>
      </div>

      <dl className="pharmacy-card__facts">
        <div>
          <dt>Form</dt>
          <dd>{medicine.form}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{formatCurrency(medicine.price)}</dd>
        </div>
        <div>
          <dt>Batch</dt>
          <dd>{medicine.batch}</dd>
        </div>
        <div>
          <dt>Expiry</dt>
          <dd>{formatDate(medicine.expiry)}</dd>
        </div>
        <div>
          <dt>Supplier</dt>
          <dd>{medicine.supplier}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{medicine.location}</dd>
        </div>
      </dl>

      <footer className="pharmacy-card__foot">
        <span className={`badge ${medicine.prescription ? 'badge--rx' : 'badge--otc'}`}>
          {medicine.prescription ? 'Rx only' : 'OTC'}
        </span>
        <button
          type="button"
          className="btn btn--soft btn--sm"
          onClick={() => onRestock?.(medicine)}
          disabled={!onRestock}
        >
          Restock
        </button>
      </footer>
    </article>
  )
}