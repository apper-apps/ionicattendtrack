import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import TodayAttendance from '@/components/pages/TodayAttendance'
import StudentRoster from '@/components/pages/StudentRoster'
import CalendarView from '@/components/pages/CalendarView'
import Analytics from '@/components/pages/Analytics'
import Reports from '@/components/pages/Reports'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TodayAttendance />} />
          <Route path="roster" element={<StudentRoster />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App