import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title';
import { getImageUrl } from '../../utils/imageUrl';
import api from '../../api/axios';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOwnerCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars');
      // In a multi-tenant setup this would be filtered by owner; here we show all available cars
      setCars(res.data.data.cars || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle listing?')) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars(cars.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 w-full'>
        <Title title='Manage Cars' subTitle='View and manage all the cars you have listed for booking.' />
        <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary mt-10'></div>
      </div>
    );
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <div className='flex items-center justify-between mb-6'>
        <Title title='Manage Cars' subTitle='View and manage all the cars you have listed for booking. Edit car details, update availability, or remove cars from your listings as needed.' align='left' />
      </div>

      {error && <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm'>{error}</div>}

      <div className='max-w-6xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full text-left text-sm text-gray-600'>
          <thead className='bg-light text-gray-700'>
            <tr>
              <th className='px-4 py-3'>Car</th>
              <th className='px-4 py-3'>Category</th>
              <th className='px-4 py-3'>Price/Day</th>
              <th className='px-4 py-3'>Location</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-500'>No cars listed yet.</td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id} className='border-t border-borderColor'>
                  <td className='p-3 flex items-center gap-3'>
                    <img src={getImageUrl(car.image)} alt='' className='h-12 w-20 object-cover rounded-md' />
                    <div>
                      <p className='font-medium'>{car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission} • {car.fuel_type}</p>
                    </div>
                  </td>
                  <td className='p-3'>{car.category}</td>
                  <td className='p-3 font-semibold'>{import.meta.env.VITE_CURRENCY || '$'} {car.pricePerDay}</td>
                  <td className='p-3'>{car.location}</td>
                  <td className='p-3'>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className='p-3'>
                    <button onClick={() => handleDelete(car._id)} className='text-red-600 text-xs hover:underline mr-3'>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCars
