import React, { useEffect, useState } from 'react'
import HomePopularTutor from '../HomePopularTutor/HomePopularTutor';

export const HomePopularTutors = () => {
  const [tutors,setTutors]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null)
  useEffect(()=>{
    try {
      fetch("http://localhost:5000/api/teachers").then(res=>res.json()).then(data=>{
        setTutors(data.sort((a,b)=>b.rating-a.rating).slice(0,Math.min(3,data.length)));
      })
      setError(null)
    } catch (error) {
      setError(error.message);
    }
    finally{
      setLoading(false);

    }
    
  },[])
  return (
    <div className='container'>
      <div className='my-5'>
        <h1 className='fw-bold text-primary'>Popular Tutors</h1>
      </div>
      <div class="card-group">
        {tutors.map(tutor=><HomePopularTutor key={tutor._id} tutor={tutor}/>)}

      </div>
    </div>
  )
}
