
import { Home } from './pages/Home/Home'
import Login from './pages/Login/Login'


import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './shared/AuthProvider/AuthProvider'

import AdminRoute from './components/AdminRoute/AdminRoute'

import { ExploreTutors } from './pages/ExploreTutors/ExploreTutors'
import TeacherRegistration from './components/TeacherRegistration/TeacherRegistration'
import StudentRegistration from './components/StudentRegistration/StudentRegistration'
import BookingForm from './components/BookingForm/BookingForm'
import TutorRoute from './components/TutorRoute/TutorRoute'
import TutorDashboard from './components/TutorDashboard/TutorDashboard'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import Payment from './components/Payment/Payment'
import StudentRoute from './components/StudentRoute/StudentRoute'
import StudentDashboard from './components/StudentDashboard/StudentDashboard'
function App() {


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' Component={Home} />

            <Route path='/register/tutor' Component={TeacherRegistration} />
            <Route path='/register/student' Component={StudentRegistration} />
            <Route path='/login' Component={Login} />
            <Route path='/explore-tutors' Component={ExploreTutors} />
            <Route path='/booking-form/:id' Component={BookingForm} />
            <Route path='/payment/:id' Component={Payment} />

            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/tutor-dashboard"
              element={
                <TutorRoute>
                  <TutorDashboard />
                </TutorRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <StudentRoute>
                  <StudentDashboard />
                </StudentRoute>
              }
            />

          </Routes>

        </BrowserRouter>
      </AuthProvider>

    </>
  )
}

export default App
