import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets, dummyCarData } from '../assets/assets';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = dummyCarData.find(car => car._id === id);

  if (!car) {
    return <Loader />; // Using Loader as requested; note: if car is not found, this will show indefinitely unless Loader handles errors
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={() => { navigate(-1) }} className='flex items-center mb-6 text-gray-500 cursor-pointer '>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        Back to all Cars
      </button>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image and Details */}
        <div className='lg:col-span-2'>
          <img src={car.image} alt={car.name} className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
          <div className='space-y-6'>
            <div className=''>
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
            </div>
            <hr className='border-borderColor my-6' />
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt='' className='h-5 mb-2' />
                  {text}
                </div>
              ))}
            </div>
            {/* Description */}
            <h1 className='text-xl font-medium mb-3'> Description</h1>
            <p className='text-gray-500'>{car.description}</p>
          </div>
          {/* Features */}
          <div className=''>
            <h1 className='text-xl font-medium mb-3'> Features </h1>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {
                ["360 Camera", "Bluetooth", "Cruise Control", "Heated Seats", "Keyless Entry"].map((item) => (
                  <li key={item} className='flex items-center text-gray-500'>
                    <img src={assets.check_icon} alt="check_icon" className='h-4 mr-4' />
                    {item}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        {/* Right: Booking Form */}
        <form action="">
          {/* Add your form fields here */}
        </form>
      </div>
    </div>
  );
};

export default CarDetails;