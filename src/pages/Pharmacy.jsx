import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PharmacyCard from '../components/PharmacyCard'
import {
  categories,
  inventoryValue,
  lowStockMedicines,
  medicines as seedMedicines,
  stockLevel,
} from '../data/medicines'
import { formatCurrency, formatNumber } from '../utils/format'
import '../styles/pharmacy.css'

const restockAmounts = {
  antibiotics: 250,
  painkillers: 500,
  vitamins: 1000,
}

export default function Pharmacy() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const query = searchParams.get('q') ?? ''
  const [items, setItems] = useState(seedMedicines)
  const [lowOnly, setLowOnly] = useState(false)
  const [notice, setNotice] = useState('')

  const counts = useMemo(
    () =>
      items.reduce((totals, medicine) => {
        totals[medicine.category] = (totals[medicine.category] ?? 0) + 1
        return totals
      }, {}),
    [items],
  )

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return items.filter((medicine) => {
      const matchesCategory = category === 'all' || medicine.category === category
      const matchesQuery =
        term === '' ||
        [medicine.name, medicine.generic, medicine.batch, medicine.supplier]
          .join(' ')
          .toLowerCase()
          .includes(term)
      const matchesStock = !lowOnly || stockLevel(medicine) !== 'ok'
      return matchesCategory && matchesQuery && matchesStock
    })
  }, [items, category, query, lowOnly])

  const lowCount = lowStockMedicines(items).length
  const value = inventoryValue(items)
  const units = items.reduce((sum, medicine) => sum + medicine.stock, 0)

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  function restock(medicine) {
    const amount = restockAmounts[medicine.category] ?? 100
    setItems((current) =>
      current.map((item) =>
        item.id === medicine.id ? { ...item, stock: item.stock + amount } : item,
      ),
    )
    setNotice(`Received ${amount} ${medicine.unit} of ${medicine.name}.`)
  }

  return (
    <div className="page pharmacy">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Dispensary</p>
          <h1>Pharmacy inventory</h1>
          <p className="page__sub">
            {visible.length} of {items.length} medicine lines shown. Category filters are kept in the
            URL so views can be bookmarked or shared.
          </p>
        </div>
        <div className="page__head-aside">
          <span className="pill-stat">
            Units <strong>{formatNumber(units)}</strong>
          </span>
          <span className="pill-stat">
            Value <strong>{formatCurrency(value)}</strong>
          </span>
          <span className="pill-stat pill-stat--warning">
            Alerts <strong>{lowCount}</strong>
          </span>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group" role="group" aria-label="Filter medicines by category">
          <span className="filter-group__label">Category</span>
          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill${category === 'all' ? ' is-active' : ''}`}
              onClick={() => updateParam('category', 'all')}
            >
              All <span>{items.length}</span>
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={`filter-pill filter-pill--${item.slug}${
                  category === item.slug ? ' is-active' : ''
                }`}
                onClick={() => updateParam('category', item.slug)}
              >
                {item.label} <span>{counts[item.slug] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group--grow">
          <label className="search-field">
            <span className="sr-only">Search medicines</span>
            <input
              type="search"
              placeholder="Search by brand, generic name, batch or supplier…"
              value={query}
              onChange={(event) => updateParam('q', event.target.value)}
            />
          </label>
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={lowOnly}
              onChange={(event) => setLowOnly(event.target.checked)}
            />
            <span>Low stock only</span>
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

      {notice && <p className="form-notice form-notice--top">{notice}</p>}

      {visible.length > 0 ? (
        <div className="card-grid card-grid--pharmacy">
          {visible.map((medicine) => (
            <PharmacyCard key={medicine.id} medicine={medicine} onRestock={restock} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No medicines match</h2>
          <p>
            Nothing found for {category !== 'all' ? `category “${category}”` : 'this view'}
            {query && ` search “${query}”`}
            {lowOnly && ' with low stock'}.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setSearchParams({})
              setLowOnly(false)
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}