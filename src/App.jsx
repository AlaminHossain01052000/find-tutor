import { Authentication } from './pages/Authentication/Authentication'
import Dashboard from './pages/Dashboard/Dashboard'
import { Home } from './pages/Home/Home'
import Login from './pages/Login/Login'


import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './shared/AuthProvider/AuthProvider'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import AdminRoute from './components/AdminRoute/AdminRoute'
import TutorApproval from './components/TutorApproval/TutorApproval'
import { ExploreTutors } from './pages/ExploreTutors/ExploreTutors'
function App() {


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' Component={Home} />
            <Route path='/registration' Component={Authentication} />
            <Route path='/login' Component={Login} />
            <Route path='/explore-tutors' Component={ExploreTutors} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard/>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin/tutorApproval"
              element={
                <AdminRoute>
                  <TutorApproval/>
                </AdminRoute>
              }
            />
          </Routes>

        </BrowserRouter>
      </AuthProvider>

    </>
  )
}

export default App
