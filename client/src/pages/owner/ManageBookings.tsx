import type { Booking, User, Car } from '../../types';
import { useEffect, useState } from 'react'
import Title from '../../components/owner/Title';
import api from '../../api/axios';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { EmptyState } from '../../components/ui/empty-state';

const statusStyle: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-800' },
  confirmed: { bg: 'bg-green-50', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-800' },
  completed: { bg: 'bg-blue-50', text: 'text-blue-800' },
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const fetchOwnerBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/owner');
      setBookings(res.data.data.bookings ?? []);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map((b) => (b._id === id ? res.data.data.booking : b)));
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Status update failed');
    }
  };

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 w-full bg-background'>
        <Title title='Manage Bookings' subTitle='View and manage bookings for your vehicles.' align='left' />
        <div className='mt-12 flex justify-center'>
          <div className='animate-pulse rounded-xl h-48 w-full max-w-xs' />
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full bg-background'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <Title title='Manage Bookings' subTitle='Approve, complete, or cancel bookings for your vehicles.' align='left' />
        </div>
      </div>

      {error && <Alert variant='error' title='Unable to load bookings'>{error}</Alert>}

      <Card padding='none'>
        <CardContent>
          {bookings.length === 0 ? (
            <EmptyState
              title='No bookings yet'
              description='Bookings for your vehicles will appear here.'
              className='py-12'
            />
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm text-text-muted'>
                <thead className='bg-background text-text'>
                  <tr>
                    <th className='px-6 py-4 font-medium text-text text-body-sm'>Customer</th>
                    <th className='px-6 py-4 font-medium text-text text-body-sm'>Vehicle</th>
                    <th className='px-6 py-4 font-medium text-text text-body-sm'>Rental period</th>
                    <th className='px-6 py-4 font-medium text-text text-body-sm'>Total price</th>
                    <th className='px-6 py-4 font-medium text-text text-body-sm'>Status</th>
                    <th className='px-6 py-4 font-medium text-text text-body-sm text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {bookings.map((booking) => {
                    const user = booking.user as User;
                    const car = booking.car as Car;
                    const style = statusStyle[booking.status] ?? statusStyle.pending;
                    return (
                      <tr key={booking._id} className='bg-surface hover:bg-muted transition-colors'>
                        <td className='px-6 py-4'>
                          <p className='font-medium text-text'>{user.name || 'Customer'}</p>
                          <p className='text-caption text-text-muted'>{user.email}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='font-medium text-text'>{car.brand} {car.model}</p>
                          <p className='text-caption text-text-muted'>{car.location}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-text'>{new Date(booking.pickupDate).toISOString().split('T')[0]}</p>
                          <p className='text-caption text-text-muted'>to {new Date(booking.returnDate).toISOString().split('T')[0]}</p>
                        </td>
                        <td className='px-6 py-4 font-semibold text-text'>{currency} {booking.totalPrice}</td>
                        <td className='px-6 py-4'>
                          <Badge variant={style.bg.includes('green') ? 'success' : style.bg.includes('red') ? 'error' : style.bg.includes('amber') ? 'warning' : 'muted'} className='text-caption'>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          {booking.status === 'pending' && (
                            <>
                              <Button variant='success' size='sm' onClick={() => updateStatus(booking._id, 'confirmed')} className='mr-2'>Confirm</Button>
                              <Button variant='danger' size='sm' onClick={() => updateStatus(booking._id, 'cancelled')}>Cancel</Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button variant='primary' size='sm' onClick={() => updateStatus(booking._id, 'completed')}>Mark completed</Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ManageBookings
