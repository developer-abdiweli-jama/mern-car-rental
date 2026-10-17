import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title';
import api from '../../api/axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const fetchOwnerBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/owner');
      setBookings(res.data.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map((b) => (b._id === id ? res.data.data.booking : b)));
    } catch (err) {
      setError(err.response?.data?.error || 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 w-full'>
        <Title title='Manage Bookings' subTitle='View and manage bookings for your vehicles.' align='left' />
        <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary mt-10'></div>
      </div>
    );
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title='Manage Bookings' subTitle='View and manage bookings for your vehicles. Approve, complete, or cancel bookings.' align='left' />

      {error && <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm'>{error}</div>}

      <div className='max-w-6xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full text-left text-sm text-gray-600'>
          <thead className='bg-light text-gray-700'>
            <tr>
              <th className='px-4 py-3'>Customer</th>
              <th className='px-4 py-3'>Vehicle</th>
              <th className='px-4 py-3'>Rental Period</th>
              <th className='px-4 py-3'>Total Price</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-500'>No bookings yet.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className='border-t border-borderColor'>
                  <td className='p-3'>
                    <p className='font-medium'>{booking.user?.name || 'Customer'}</p>
                    <p className='text-xs text-gray-500'>{booking.user?.email}</p>
                  </td>
                  <td className='p-3'>
                    <p className='font-medium'>{booking.car?.brand} {booking.car?.model}</p>
                    <p className='text-xs text-gray-500'>{booking.car?.location}</p>
                  </td>
                  <td className='p-3'>
                    <p className='text-sm'>{new Date(booking.pickupDate).toISOString().split('T')[0]}</p>
                    <p className='text-xs text-gray-500'>to {new Date(booking.returnDate).toISOString().split('T')[0]}</p>
                  </td>
                  <td className='p-3 font-semibold'>{currency} {booking.totalPrice}</td>
                  <td className='p-3'>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className='p-3'>
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(booking._id, 'confirmed')} className='text-green-600 text-xs hover:underline mr-2'>Confirm</button>
                        <button onClick={() => updateStatus(booking._id, 'cancelled')} className='text-red-600 text-xs hover:underline'>Cancel</button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => updateStatus(booking._id, 'completed')} className='text-blue-600 text-xs hover:underline'>Mark Completed</button>
                    )}
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

export default ManageBookings
