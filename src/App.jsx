import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/patients/Patients'
import PatientDetails from './pages/patients/PatientDetails'
import PatientHistory from './pages/patients/PatientHistory'
import PatientBilling from './pages/patients/PatientBilling'
import Appointments from './pages/Appointments'
import Billing from './pages/Billing'
import Pharmacy from './pages/Pharmacy'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="patients/:id/history" element={<PatientHistory />} />
          <Route path="patients/:id/billing" element={<PatientBilling />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="billing" element={<Billing />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}