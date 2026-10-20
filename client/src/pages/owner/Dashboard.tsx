import type { Booking, Car } from '../../types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import api from '../../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { EmptyState } from '../../components/ui/empty-state';
import { Skeleton } from '../../components/ui/skeleton';
import { getImageUrl } from '../../utils/imageUrl';

type OwnerStat = {
  totalCars: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  monthlyRevenue: number;
  recentBookings: Booking[];
  recentCars: Car[];
};

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [stats, setStats] = useState<OwnerStat>({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    monthlyRevenue: 0,
    recentBookings: [],
    recentCars: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [carsRes, bookingsRes] = await Promise.all([
        api.get('/cars/mine'),
        api.get('/bookings/owner'),
      ]);
      const cars = carsRes.data.data.cars ?? [];
      const bookings = (bookingsRes.data.data.bookings ?? []) as Booking[];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = bookings
        .filter((b) => b.status === 'confirmed' && new Date(b.createdAt ?? '') >= monthStart)
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

      setStats({
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
        confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
        monthlyRevenue,
        recentBookings: bookings.slice(0, 5),
        recentCars: cars.slice(0, 4),
      });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 flex-1 bg-background'>
        <Title title='Owner Dashboard' subTitle='Monitor your fleet performance including cars, bookings, revenue, and recent activities.' />
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-4xl'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} padding='md'>
              <Skeleton className='h-10 w-32 mb-3' />
              <Skeleton className='h-4 w-24' />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-4 pt-10 md:px-10 flex-1 bg-background'>
        <Title title='Owner Dashboard' subTitle='Monitor your fleet performance.' align='left' />
        <div className='mt-12 max-w-md'>
          <Alert variant='error' title='Unable to load dashboard'>{error}</Alert>
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Total Cars', value: stats.totalCars, icon: assets.carIconColored },
    { title: 'Total Bookings', value: stats.totalBookings, icon: assets.listIconColored },
    { title: 'Pending', value: stats.pendingBookings, icon: assets.cautionIconColored },
    { title: 'Confirmed', value: stats.confirmedBookings, icon: assets.listIconColored },
  ];

  return (
    <div className='px-4 pt-10 md:px-10 flex-1 bg-background'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <Title title='Owner Dashboard' subTitle='Monitor your fleet performance including cars, bookings, revenue, and recent activities.' align='left' />
        </div>
        <Button onClick={() => navigate('/owner/add-car')} className='hidden sm:inline-flex'>
          Add a car
        </Button>
      </div>

      {error && <Alert variant='error' title='Unable to load dashboard'>{error}</Alert>}

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 max-w-4xl'>
        {cards.map((card) => (
          <Card key={card.title} padding='md'>
            <CardHeader className='flex items-center justify-between mb-0'>
              <div>
                <CardTitle className='text-body-sm text-text-muted'>{card.title}</CardTitle>
                <p className='text-h2 font-bold text-text'>{card.value}</p>
              </div>
              <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                <img src={card.icon} alt={card.title} className='h-5 w-5 text-primary' />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <Card padding='none'>
            <CardHeader className='flex items-center justify-between mb-6'>
              <CardTitle>Recent bookings</CardTitle>
              {stats.totalBookings === 0 && <span className='text-caption text-text-muted'>No recent bookings.</span>}
            </CardHeader>
            <CardContent>
              {stats.recentBookings.length === 0 ? (
                <p className='text-body-sm text-text-muted text-center py-8'>No recent bookings.</p>
              ) : (
                <div className='space-y-4'>
                  {stats.recentBookings.map((booking, index) => {
                    const car = booking.car as { brand?: string; model?: string };
                    return (
                      <div key={index} className='flex items-center gap-4 p-3 rounded-xl border border-border bg-surface'>
                        <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0'>
                          <img
                            src={getImageUrl((car as Car).image) || assets.car_image1}
                            onError={(event) => { (event.target as HTMLImageElement).src = assets.car_image1; }}
                            alt=''
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-body-sm font-medium text-text truncate'>{car.brand} {car.model}</p>
                          <p className='text-caption text-text-muted'>{new Date(booking.createdAt ?? '').toISOString().split('T')[0]}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-body-sm font-semibold text-text'>{currency} {booking.totalPrice}</p>
                          <Badge variant='outline' className='text-caption'>{booking.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-1'>
          <Card padding='none'>
            <CardHeader className='mb-6'>
              <CardTitle>Your fleet</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentCars.length === 0 ? (
                <EmptyState
                  title='No cars listed yet'
                  description='List your first vehicle to start earning.'
                  actionLabel='Add a car'
                  onAction={() => navigate('/owner/add-car')}
                  className='py-6'
                />
              ) : (
                <div className='space-y-4'>
                  {stats.recentCars.map((car) => (
                    <div key={car._id} className='flex items-center gap-4 p-3 rounded-xl border border-border bg-surface'>
                      <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0'>
                        <img
                          src={getImageUrl(car.image) || assets.car_image1}
                          onError={(event) => { (event.target as HTMLImageElement).src = assets.car_image1; }}
                          alt=''
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-body-sm font-medium text-text truncate'>{car.brand} {car.model}</p>
                        <p className='text-caption text-text-muted'>{car.location}</p>
                      </div>
                      <Badge variant={car.isAvailable ? 'success' : 'outline'} className='text-caption'>
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='mt-8 flex justify-end'>
        <Badge variant='outline' className='text-caption'>
          Monthly revenue {currency} {stats.monthlyRevenue}
        </Badge>
      </div>
    </div>
  );
};

export default Dashboard;
