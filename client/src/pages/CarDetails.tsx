import type { Car } from '../types';
import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';
import { getImageUrl } from '../utils/imageUrl';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
  const [booking, setBooking] = useState<{ totalPrice: number; status: string } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data.data.car ?? null);
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
      setAvailable(!!res.data.data.available);
      setBookingError(null);
    } catch {
      setAvailable(null);
    }
  }, [pickupDate, returnDate, id]);

  useEffect(() => {
    const timer = setTimeout(checkAvailability, 400);
    return () => clearTimeout(timer);
  }, [pickupDate, returnDate, id, checkAvailability]);

  const handleSubmit = async (e: FormEvent) => {
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
      setBooking({ totalPrice: res.data.data.booking.totalPrice, status: res.data.data.booking.status });
      setPickupDate('');
      setReturnDate('');
      setAvailable(null);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBookingError((err as any)?.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (authLoading || loading) return <Loader />;
  if (error || !car) return (
    <div className='px-6 md:px-12 py-20 text-center'>
      <h2 className='text-h2 font-semibold text-text'>Vehicle not found</h2>
      <p className='text-body-sm text-text-muted mt-2'>The car you requested does not exist.</p>
    </div>
  );

  const currency = import.meta.env.VITE_CURRENCY || '$';
  const days =
    pickupDate && returnDate
      ? Math.max(Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)), 1)
      : 0;
  const estimatedTotal = days && car.pricePerDay ? days * car.pricePerDay : null;

  return (
    <div className='px-6 md:px-12 lg:px-24 py-12 max-w-7xl mx-auto'>
      <button
        onClick={() => { navigate(-1); }}
        className='inline-flex items-center gap-2 mb-8 text-body-sm text-text-muted hover:text-primary transition-colors'
      >
        <img src={assets.arrow_icon} alt='' className='w-4 h-4 rotate-180' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8'>
          <img
            src={getImageUrl(car.image) || assets.car_image1}
            onError={(event) => { (event.target as HTMLImageElement).src = assets.car_image1; }}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-80 rounded-2xl object-cover mb-6 shadow-md'
          />
          {!car.isAvailable && (
            <p className='mb-6 text-error font-medium'>Currently unavailable for rent</p>
          )}
          <div className='space-y-6'>
            <div>
              <h1 className='text-display-lg font-bold text-text'>{car.brand} {car.model}</h1>
              <p className='text-body text-text-muted'>{car.category} • {car.year}</p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-background p-4 rounded-xl'>
                  <img src={icon} alt='' className='h-5 mb-2' />
                  <span className='text-caption text-text-muted'>{text}</span>
                </div>
              ))}
            </div>
            <h3 className='text-body font-semibold text-text mb-2'>Description</h3>
            <p className='text-body-sm text-text-muted'>{car.description || 'No description available.'}</p>
            <h3 className='text-body font-semibold text-text mb-3 mt-6'>Features</h3>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {['360 Camera', 'Bluetooth', 'Cruise Control', 'Heated Seats', 'Keyless Entry'].map((item) => (
                <li key={item} className='flex items-center gap-3 text-body-sm text-text-muted'>
                  <img src={assets.check_icon} alt='check' className='w-4 h-4 text-success' />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='lg:col-span-4 sticky top-24'>
          <Card padding='none'>
            <CardHeader>
              <CardTitle>From {currency} {car.pricePerDay} / day</CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Input
                    label='Pickup date'
                    id='pickup-date'
                    type='date'
                    value={pickupDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    error={available === false ? 'Not available for selected dates' : undefined}
                  />
                </div>
                <div>
                  <Input
                    label='Return date'
                    id='return-date'
                    type='date'
                    value={returnDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setReturnDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    error={available === false ? 'Not available for selected dates' : undefined}
                  />
                </div>
                {estimatedTotal && (
                  <div className='flex items-center justify-between text-body-sm'>
                    <span className='text-text-muted'>Estimated total</span>
                    <span className='font-semibold text-text'>{currency} {estimatedTotal}</span>
                  </div>
                )}
                {bookingError && <Alert variant='error' title='Booking failed'>{bookingError}</Alert>}
                <Button
                  type='submit'
                  isLoading={bookingLoading}
                  isDisabled={!user || available === false || !pickupDate || !returnDate}
                  className='w-full'
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </Button>
                <p className='text-caption text-text-muted text-center'>No credit card required to reserve</p>
              </form>
              {booking && (
                <Alert variant='success' title='Booking confirmed!'>
                  Total: {currency} {booking.totalPrice} • Status: {booking.status}. Check My Bookings for details.
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
