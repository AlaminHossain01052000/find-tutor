import React from 'react'
import Tutors from '../../components/Tutors/Tutors'
import { Link } from 'react-router-dom'

export const ExploreTutors = () => {
  return (
    <div>
      <div className='container'>
        <Link to="/" className='btn btn-primary my-5'>Home</Link>
      </div>
    <Tutors/>
    </div>
    
  )
}
