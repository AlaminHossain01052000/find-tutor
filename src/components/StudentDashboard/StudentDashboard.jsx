import React from 'react'
import { Link } from 'react-router-dom'
import MyClasses from '../MyClasses/MyClasses'

export const StudentDashboard = () => {
  return (
    <div className='container my-5'>
      <Link to="/" className='btn btn-primary'>Home</Link>
      <div>
        <MyClasses/>
      </div>
    </div>
  )
}
