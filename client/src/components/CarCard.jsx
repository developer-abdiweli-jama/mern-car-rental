import React from 'react'

const CarCard = ({ car }) => {
    return (
        <div className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
            <div className="">
                <img src={car.image} alt='Car Image' className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'/>
                {car.isAvaliable && <p className='absolute'>Available Now</p>}
            </div>
            <div className="">

            </div>

        </div>
    )
}

export default CarCard
