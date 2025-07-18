import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export const HomeNavabr = () => {
  const { user, logoutUser } = useAuth();
  console.log(user)
  const handleLogout = () => {
    logoutUser()
  }
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore-tutors">
                Tutors
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/student-dashboard">
                Dashboard
              </Link>
            </li>
              {user?.uid ?
                <li className="nav-item">
                  <Link className="nav-link" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
                :
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              }

            
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
