import type { Car } from '../../types';
import { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { getImageUrl } from '../../utils/imageUrl';
import api from '../../api/axios';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { EmptyState } from '../../components/ui/empty-state';
import { useNavigate } from 'react-router-dom';

const ManageCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars/mine');
      setCars(res.data.data.cars ?? []);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this vehicle listing?')) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars(cars.filter((c) => c._id !== id));
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 w-full bg-background'>
        <Title title='Manage Cars' subTitle='View and manage your vehicle listings.' align='left' />
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
          <Title title='Manage Cars' subTitle='View and manage your vehicle listings. Edit details, update availability, or remove cars.' align='left' />
        </div>
        <Button onClick={() => navigate('/owner/add-car')}>
          <img src={assets.addIcon} alt='' className='w-4 h-4 mr-2' />
          Add a car
        </Button>
      </div>

      {error && <Alert variant='error' title='Unable to load cars'>{error}</Alert>}

      <Card padding='none'>
        <CardContent>
          {cars.length === 0 ? (
            <EmptyState
              title='No cars listed yet'
              description='List your first vehicle to start accepting bookings.'
              actionLabel='Add a car'
              onAction={() => navigate('/owner/add-car')}
              className='py-12'
            />
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[760px] text-left text-sm text-text-muted'>
                <caption className='sr-only'>Your vehicle listings and management actions</caption>
                <thead className='sticky top-0 z-10 border-b border-border bg-background text-text'>
                  <tr>
                    <th scope='col' className='px-6 py-4 font-medium text-text text-body-sm'>Car</th>
                    <th scope='col' className='px-6 py-4 font-medium text-text text-body-sm'>Category</th>
                    <th scope='col' className='px-6 py-4 font-medium text-text text-body-sm'>Price/day</th>
                    <th scope='col' className='px-6 py-4 font-medium text-text text-body-sm'>Location</th>
                    <th scope='col' className='px-6 py-4 font-medium text-text text-body-sm'>Status</th>
                    <th scope='col' className='px-6 py-4 font-medium text-text text-body-sm text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {cars.map((car) => (
                    <tr key={car._id} className='bg-surface transition-colors hover:bg-background'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={getImageUrl(car.image) || assets.car_image1}
                            onError={(event) => { (event.target as HTMLImageElement).src = assets.car_image1; }}
                            alt=''
                            className='h-12 w-20 object-cover rounded-md'
                          />
                          <div>
                            <p className='font-medium text-text'>{car.brand} {car.model}</p>
                            <p className='text-caption text-text-muted'>{car.seating_capacity} seats • {car.transmission} • {car.fuel_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>{car.category}</td>
                      <td className='px-6 py-4 font-semibold text-text'>{import.meta.env.VITE_CURRENCY || '$'} {car.pricePerDay}</td>
                      <td className='px-6 py-4'>{car.location}</td>
                      <td className='px-6 py-4'>
                        <Badge variant={car.isAvailable ? 'success' : 'outline'} className='text-caption'>
                          {car.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button variant='outline' size='sm' aria-label={`Edit ${car.brand} ${car.model}`} onClick={() => navigate(`/owner/edit-car/${car._id}`)}>Edit</Button>
                          <Button variant='danger' size='sm' aria-label={`Delete ${car.brand} ${car.model}`} onClick={() => handleDelete(car._id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ManageCars
