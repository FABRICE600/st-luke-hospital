export const appointmentStatuses = ['Scheduled', 'Completed', 'Cancelled']

export const appointments = [
  {
    id: 'APT-3001',
    patientId: 'P-1001',
    patientName: 'Amara Okonkwo',
    doctor: 'Dr. Emeka Obi',
    department: 'Cardiology',
    date: '2026-03-05',
    time: '09:00',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Blood pressure review and medication titration',
    fee: 5000,
  },
  {
    id: 'APT-3002',
    patientId: 'P-1003',
    patientName: 'Chioma Eze',
    doctor: 'Dr. Chidi Nwosu',
    department: 'Paediatrics',
    date: '2026-03-05',
    time: '10:30',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Tonsillitis recurrence check',
    fee: 8000,
  },
  {
    id: 'APT-3003',
    patientId: 'P-1005',
    patientName: 'Grace Adeyinka',
    doctor: 'Dr. Fatima Bello',
    department: 'General Medicine',
    date: '2026-03-05',
    time: '12:00',
    type: 'Diagnostics',
    status: 'Scheduled',
    reason: 'HbA1c and neuropathy screening',
    fee: 9500,
  },
  {
    id: 'APT-3004',
    patientId: 'P-1010',
    patientName: 'Yusuf Abdullahi',
    doctor: 'Dr. Fatima Bello',
    department: 'General Medicine',
    date: '2026-03-05',
    time: '14:30',
    type: 'Consultation',
    status: 'Scheduled',
    reason: 'Epigastric pain reassessment',
    fee: 5000,
  },
  {
    id: 'APT-3005',
    patientId: 'P-1002',
    patientName: 'Bello Muhammad',
    doctor: 'Dr. Amina Yusuf',
    department: 'Orthopaedics',
    date: '2026-03-06',
    time: '08:30',
    type: 'Physiotherapy',
    status: 'Scheduled',
    reason: 'Post-operative gait training',
    fee: 6000,
  },
  {
    id: 'APT-3006',
    patientId: 'P-1007',
    patientName: 'Zainab Bello',
    doctor: 'Dr. Fatima Bello',
    department: 'General Medicine',
    date: '2026-03-06',
    time: '11:00',
    type: 'Ward Review',
    status: 'Scheduled',
    reason: 'Antibiotic step-down review',
    fee: 4000,
  },
  {
    id: 'APT-3007',
    patientId: 'P-1009',
    patientName: 'Esther Gloria',
    doctor: 'Dr. Emeka Obi',
    department: 'Cardiology',
    date: '2026-03-07',
    time: '15:00',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Echocardiogram and fluid status review',
    fee: 12000,
  },
  {
    id: 'APT-3008',
    patientId: 'P-1004',
    patientName: 'Ibrahim Sanni',
    doctor: 'Dr. Tunde Adeyemi',
    department: 'Neurology',
    date: '2026-02-12',
    time: '10:00',
    type: 'Follow-up',
    status: 'Completed',
    reason: '4-week post-stroke neurology review',
    fee: 7500,
  },
  {
    id: 'APT-3009',
    patientId: 'P-1006',
    patientName: 'Obinna Chukwu',
    doctor: 'Dr. Fatima Bello',
    department: 'Dermatology',
    date: '2026-02-22',
    time: '13:00',
    type: 'Consultation',
    status: 'Completed',
    reason: 'Rash review after 5 days of treatment',
    fee: 9000,
  },
  {
    id: 'APT-3010',
    patientId: 'P-1008',
    patientName: 'Kelechi Nnamdi',
    doctor: 'Dr. Amina Yusuf',
    department: 'Orthopaedics',
    date: '2026-02-17',
    time: '09:30',
    type: 'Physiotherapy',
    status: 'Cancelled',
    reason: 'Discharge physiotherapy follow-up',
    fee: 6000,
  },
  {
    id: 'APT-3011',
    patientId: 'P-1003',
    patientName: 'Chioma Eze',
    doctor: 'Dr. Chidi Nwosu',
    department: 'Paediatrics',
    date: '2026-02-19',
    time: '11:30',
    type: 'Consultation',
    status: 'Completed',
    reason: 'Sore throat and fever — 3 days history',
    fee: 8000,
  },
  {
    id: 'APT-3012',
    patientId: 'P-1005',
    patientName: 'Grace Adeyinka',
    doctor: 'Dr. Fatima Bello',
    department: 'General Medicine',
    date: '2026-02-28',
    time: '10:00',
    type: 'Diagnostics',
    status: 'Completed',
    reason: 'Annual diabetic foot screening',
    fee: 9500,
  },
]

export const slots = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
]

export const appointmentTypes = [
  'Consultation',
  'Follow-up',
  'Diagnostics',
  'Physiotherapy',
  'Ward Review',
  'Procedure',
]

export function appointmentsForPatient(patientId) {
  return appointments.filter((appointment) => appointment.patientId === patientId)
}

export function appointmentsForDoctor(doctor) {
  return appointments.filter((appointment) => appointment.doctor === doctor)
}

export function filterAppointmentsByStatus(list, status) {
  if (!status || status === 'all') return list
  return list.filter((appointment) => appointment.status === status)
}

export function sortAppointments(list) {
  return [...list].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
  )
}

export function nextAppointmentId(list) {
  const highest = list.reduce((max, appointment) => {
    const number = Number(appointment.id.replace('APT-', ''))
    return Number.isNaN(number) ? max : Math.max(max, number)
  }, 3000)
  return `APT-${highest + 1}`
}