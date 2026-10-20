import type { Booking, Car } from '../types';
import { useEffect, useState } from 'react';
import Title from '../components/Title';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';
import { getImageUrl } from '../utils/imageUrl';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/ui/empty-state';
import { Alert } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { assets } from '../assets/assets';

const statusStyle: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-800' },
  confirmed: { bg: 'bg-green-50', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-800' },
  completed: { bg: 'bg-blue-50', text: 'text-blue-800' },
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/me');
      setBookings(res.data.data.bookings ?? []);
      setError(null);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverMessage = (err as any)?.response?.data?.error;
      setError(serverMessage || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map((b) => (b._id === id ? { ...b, status: 'cancelled' as const, paymentStatus: 'refunded' as const } : b)));
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverMessage = (err as any)?.response?.data?.error;
      setError(serverMessage || 'Cancel failed');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className='px-6 md:px-12 py-20 text-center'>
        <Title title='My Bookings' subTitle='View and manage your car bookings' align='left' />
        <div className='flex flex-col items-center gap-4 mt-12'>
          <Skeleton className='w-48 h-48 rounded-full' />
          <Skeleton className='w-32 h-4' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-6 md:px-12 py-20 text-center'>
        <Title title='My Bookings' subTitle='View and manage your car bookings' align='left' />
        <Alert variant='error' title='Unable to load bookings'>{error}</Alert>
      </div>
    );
  }

  return (
    <div className='px-6 md:px-12 lg:px-24 2xl:px-32 mt-10 max-w-7xl'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <Title title='My Bookings' subTitle='View and manage your car bookings' align='left' />
        </div>
      </div>

      {error && <Alert variant='error' title='Unable to load bookings'>{error}</Alert>}

      {bookings.length === 0 ? (
        <EmptyState
          title='No bookings yet'
          description="You haven't made any car bookings. Start by browsing our fleet."
          actionLabel='Browse cars'
          onAction={() => window.location.assign('/cars')}
        />
      ) : (
        <div className='grid gap-6'>
          {bookings.map((booking) => {
            const car = booking.car as Car;
            const style = statusStyle[booking.status] ?? statusStyle.pending;
            return (
              <div key={booking._id} className='card-hover border border-border rounded-2xl bg-surface p-6 shadow-soft'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-start'>
                  <div className='md:col-span-4'>
                    <div className='aspect-video overflow-hidden rounded-xl mb-4'>
                      <img
                        src={getImageUrl(car.image) || assets.car_image1}
                        onError={(event) => { (event.target as HTMLImageElement).src = assets.car_image1; }}
                        alt={`${car.brand} ${car.model}`}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <h3 className='text-body font-semibold text-text'>{car.brand} {car.model}</h3>
                    <p className='text-caption text-text-muted'>{car.year} • {car.category} • {car.location}</p>
                  </div>
                  <div className='md:col-span-5'>
                    <div className='flex items-center gap-2 mb-4'>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md ${style.bg} ${style.text} text-caption font-medium`}>
                        {booking.status}
                      </span>
                      <span className='text-caption text-text-muted'>Booking #{booking._id.slice(-6)}</span>
                    </div>
                    <div className='space-y-3 mb-6'>
                      <div className='flex items-center gap-2'>
                        <img src={assets.calendar_icon_colored} alt='' className='w-4 h-4' />
                        <div>
                          <p className='text-caption text-text-muted'>Rental period</p>
                          <p className='text-body-sm text-text'>{new Date(booking.pickupDate).toISOString().split('T')[0]} to {new Date(booking.returnDate).toISOString().split('T')[0]}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <img src={assets.location_icon_colored} alt='' className='w-4 h-4' />
                        <div>
                          <p className='text-caption text-text-muted'>Pick-up location</p>
                          <p className='text-body-sm text-text'>{car.location}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <img src={assets.check_icon} alt='' className='w-4 h-4' />
                        <div>
                          <p className='text-caption text-text-muted'>Booked on</p>
                          <p className='text-body-sm text-text'>{booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='md:col-span-3 flex flex-col justify-between'>
                    <div>
                      <p className='text-caption text-text-muted'>Total price</p>
                      <p className='text-h3 font-bold text-text'>{currency} {booking.totalPrice}</p>
                    </div>
                    {booking.status === 'pending' || booking.status === 'confirmed' ? (
                      <Button
                        variant='danger'
                        onClick={() => handleCancel(booking._id)}
                        isLoading={cancelling === booking._id}
                        className='w-full'
                      >
                        Cancel booking
                      </Button>
                    ) : (
                      <p className='text-caption text-text-muted'>This booking cannot be cancelled.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
