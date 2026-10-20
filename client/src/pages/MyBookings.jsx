import { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';
import { getImageUrl } from '../utils/imageUrl';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/me');
      setBookings(res.data.data.bookings || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user]);

  if (loading) {
    return (
      <div className='px-6 md:px-12 py-20 text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary mx-auto'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-6 md:px-12 py-20 text-center'>
        <h2 className='text-xl font-semibold text-gray-800'>{error}</h2>
      </div>
    );
  }

  return (
    <div className='px-6 md:px-12 lg:px-24 2xl:px-32 mt-16 text-sm max-w-7xl'>
      <Title title='My Bookings' subTitle='View and manage your car bookings' align='left' />
      {bookings.length === 0 ? (
        <p className='text-gray-500 text-center py-10'>You have no bookings yet.</p>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img src={getImageUrl(booking.car?.image) || assets.car_image1} onError={(event) => { event.currentTarget.src = assets.car_image1; }} alt='' className='w-full h-auto aspect-video object-cover' />
                </div>
                <p className='text-lg font-medium mt-2'>{booking.car?.brand} {booking.car?.model}</p>
                <p className='text-gray-500'>{booking.car?.year} • {booking.car?.category} • {booking.car?.location}</p>
              </div>

              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <p className='px-3 py-1.5 bg-light rounded'>Booking #{booking._id.slice(-6)}</p>
                  <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {booking.status}
                  </p>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.calendar_icon_colored} alt='' className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500 text-sm'>Rental Period</p>
                    <p className='text-sm'>{new Date(booking.pickupDate).toISOString().split('T')[0]} To {new Date(booking.returnDate).toISOString().split('T')[0]}</p>
                  </div>
                </div>
                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.location_icon_colored} alt='' className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500 text-sm'>Pick-up Location</p>
                    <p className='text-sm'>{booking.car?.location}</p>
                  </div>
                </div>
              </div>

              <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                <div className='text-sm text-gray-500 text-right'>
                  <p>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>{currency} {booking.totalPrice}</h1>
                  <p>Booked on {new Date(booking.createdAt).toISOString().split('T')[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
