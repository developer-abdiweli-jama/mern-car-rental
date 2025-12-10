import React, { useEffect, useState } from 'react'
import { dummyCarData } from '../../assets/assets';
import Title from '../../components/owner/Title';

const ManageCars = () => {

  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    setCars(dummyCarData);
  }

  useEffect(() => {
    fetchOwnerCars();
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Cars" subTitle="View and manage all the cars you have listed for booking. Edit car details, update availability, or remove cars from your listings as needed." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full text-left text-sm text-gray-500'>
          <thead className='bg-gray-100 text-gray-600'>
            <tr>
              <th className='px-4 py-3'>Car</th>
              <th className='px-4 py-3'>Category</th>
              <th className='px-4 py-3'>Price/Day</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt="" className='h-12 w-20 object-cover aspect-square rounded-md' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  )
}

export default ManageCars
