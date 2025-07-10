import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePopularTutor = ({tutor}) => {
    const {profilePic,firstName,lastName,categories}=tutor||{};
    const navigate=useNavigate()
    const handleNavigate=()=>{
        navigate('/explore-tutors')
    }
    return (
        <div class="card">
            <img src={profilePic} alt={firstName} class="card-img-top"/>
            <div class="card-body">
                <h5 class="card-title text-center fw-bold">{firstName} {lastName}</h5>
               
            </div>
            <div className='d-md-flex justify-content-around'>
                {
                    categories.map(category=><button key={category} className='btn btn-primary mb-3'>{category}</button>)
                }
            </div>
            <button className="btn btn-dark fw-bold mt-3" onClick={handleNavigate}>View More</button>
        </div>
    );
};

export default HomePopularTutor;