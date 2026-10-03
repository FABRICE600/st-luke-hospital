# St. Luke General Hospital

A hospital management portal built with React 19, Vite and React Router 7. It covers patient
records, medical history, appointments, billing and pharmacy inventory, with URL-driven filters.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
npm run lint     # eslint
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Dashboard |
| `/patients` | Patient list with filters |
| `/patients/:id` | Patient details |
| `/patients/:id/history` | Medical history timeline |
| `/patients/:id/billing` | Patient statement |
| `/appointments` | Appointment schedule + booking form |
| `/billing` | All invoices and payments |
| `/pharmacy` | Pharmacy inventory |
| `/home` | Redirects to `/` |
| `*` | 404 page |

### Query parameters

Filters are stored in the URL so views can be bookmarked, shared and navigated back from.

```
/patients?status=admitted
/patients?status=discharged
/patients?status=outpatient
/patients?q=okonkwo

/pharmacy?category=antibiotics
/pharmacy?category=painkillers
/pharmacy?category=vitamins

/appointments?status=Scheduled
/billing?status=pending
```

Invalid values simply fall back to the "All" view rather than erroring.

## Project structure

```
public/
  images/hospital-logo.png   logo used in navbar and footer
  images/doctor.jpg          profile photo in the navbar
  favicon.ico
src/
  components/   Navbar, Footer, Layout (shell with <Outlet/>), PatientCard, PharmacyCard
  pages/        one file per route, nested patient pages in pages/patients/
  data/         patients.js, appointments.js, medicines.js — plain JS objects plus selectors
  styles/       global.css tokens + one stylesheet per area
  utils/        shared currency, date and label formatters
  App.jsx       BrowserRouter and route table
```

`Layout.jsx` renders the navbar, the routed page through `<Outlet />` and the footer, and resets
scroll position on navigation. Every other page is a child route, so adding a route means adding
one `<Route>` inside the existing shell.

## Features

- **Dashboard** — headline figures, ward occupancy by department, upcoming schedule, admitted
  patients and pharmacy alerts.
- **Patients** — search plus `?status=` pills, patient cards linking to details, history and
  billing, empty state when nothing matches.
- **Patient records** — vitals, admission details, allergies, insurance, appointment list, event
  timeline and invoices with a working "mark paid" action.
- **Appointments** — day-grouped schedule, `?status=` filter, complete/cancel actions and a
  booking form that adds a new slot to the list.
- **Billing** — hospital-wide invoice table with payment filter, search, totals per patient and
  outstanding balance.
- **Pharmacy** — inventory cards with stock bars, `?category=` filter, low-stock toggle and a
  restock action that increases the on-hand quantity.

## Notes

- Data is static and lives in `src/data/`; mutating actions such as "mark paid", "cancel" and
  "restock" only update React state and reset on reload.
- `src/utils/format.js` holds the currency/date helpers shared by several pages.
- The images in `public/images/` are generated placeholders — replace them with real artwork.