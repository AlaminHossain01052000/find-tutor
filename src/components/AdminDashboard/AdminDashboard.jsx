import React from 'react'
import { Link } from 'react-router-dom'
import TutorApproval from '../TutorApproval/TutorApproval'

export const AdminDashboard = () => {
  return (
    <div className='container'>
    <Link to="/" className='btn btn-secondary fw-bold my-5'>Home</Link>
    <div>
      <TutorApproval/>
    </div>
    </div>
  )
}
