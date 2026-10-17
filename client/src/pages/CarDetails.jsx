import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';
import { getImageUrl } from '../utils/imageUrl';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data.data.car);
        setError(null);
      } catch {
        setError('Vehicle not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const checkAvailability = useCallback(async () => {
    if (!pickupDate || !returnDate) return;
    try {
      const res = await api.get('/bookings/availability', {
        params: { carId: id, pickupDate, returnDate },
      });
      setAvailable(res.data.data.available);
      setBookingError(null);
    } catch {
      setAvailable(null);
    }
  }, [pickupDate, returnDate, id]);

  useEffect(() => {
    const timer = setTimeout(checkAvailability, 400);
    return () => clearTimeout(timer);
  }, [pickupDate, returnDate, id, checkAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!pickupDate || !returnDate) {
      setBookingError('Please select both dates');
      return;
    }
    setBookingLoading(true);
    setBookingError(null);
    try {
      const res = await api.post('/bookings', {
        carId: id,
        pickupDate,
        returnDate,
      });
      setBooking(res.data.data.booking);
      setPickupDate('');
      setReturnDate('');
      setAvailable(null);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (authLoading) return <Loader />;
  if (loading) return <Loader />;
  if (error || !car) return (
    <div className='px-6 md:px-12 text-center py-20'>
      <h2 className='text-2xl font-semibold text-gray-800'>Vehicle not found</h2>
      <p className='text-gray-500 mt-2'>The car you requested does not exist.</p>
    </div>
  );

  const currency = import.meta.env.VITE_CURRENCY || '$';
  const days =
    pickupDate && returnDate
      ? Math.max(Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)), 1)
      : 0;
  const estimatedTotal = days && car.pricePerDay ? days * car.pricePerDay : null;

  return (
    <div className='px-6 md:px-12 lg:px-24 xl:px-32 mt-16'>
      <button
        onClick={() => { navigate(-1); }}
        className='flex items-center mb-6 text-gray-500 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65 w-5 h-5 mr-2' />
        Back to all Cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        <div className='lg:col-span-2'>
          <img src={getImageUrl(car.image) || assets.car_image1} alt={car.brand + ' ' + car.model} className='w-full h-96 md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
          {!car.isAvailable && (
            <p className='text-red-600 font-medium mb-4'>Currently unavailable for rent</p>
          )}
          <div className='space-y-6'>
            <div>
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
                  <span className='text-sm text-gray-600'>{text}</span>
                </div>
              ))}
            </div>
            <h2 className='text-xl font-medium mb-3'>Description</h2>
            <p className='text-gray-500'>{car.description || 'No description available.'}</p>
            <h2 className='text-xl font-medium mb-3 mt-6'>Features</h2>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {['360 Camera', 'Bluetooth', 'Cruise Control', 'Heated Seats', 'Keyless Entry'].map((item) => (
                <li key={item} className='flex items-center text-gray-500'>
                  <img src={assets.check_icon} alt='check_icon' className='h-4 mr-4' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='lg:col-span-1 sticky top-20'>
          <div className='bg-white p-6 rounded-xl shadow border border-borderColor'>
            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold mb-4'>
              {currency} {car.pricePerDay}
              <span className='text-base text-gray-400 font-normal'>per day</span>
            </p>
            <hr className='border-borderColor mb-4' />

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label htmlFor='pickup-date' className='block text-sm font-medium text-gray-700 mb-1'>
                  Pickup Date
                </label>
                <input
                  type='date'
                  id='pickup-date'
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className='w-full px-3 py-2 border border-borderColor rounded-lg outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
              <div>
                <label htmlFor='return-date' className='block text-sm font-medium text-gray-700 mb-1'>
                  Return Date
                </label>
                <input
                  type='date'
                  id='return-date'
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className='w-full px-3 py-2 border border-borderColor rounded-lg outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
              {estimatedTotal && (
                <p className='text-sm text-gray-600'>
                  Estimated total: <span className='font-semibold'>{currency} {estimatedTotal}</span>
                </p>
              )}
              {available === false && (
                <p className='text-sm text-red-600'>Not available for selected dates</p>
              )}
              {bookingError && <p className='text-sm text-red-600'>{bookingError}</p>}
              <button
                type='submit'
                disabled={bookingLoading || !user || available === false || !pickupDate || !returnDate}
                className='w-full bg-primary disabled:bg-primary-dull text-white py-3 rounded-xl font-medium hover:bg-primary-dull transition-all cursor-pointer disabled:cursor-not-allowed'
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
              <p className='text-center text-sm text-gray-500'>No credit card required to reserve</p>
            </form>

            {booking && (
              <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800'>
                <p className='font-semibold'>Booking confirmed!</p>
                <p>Total: {currency} {booking.totalPrice} • Status: {booking.status}</p>
                <p className='mt-2'>Check My Bookings for details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
