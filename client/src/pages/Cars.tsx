import type { Car } from '../types';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Title from '../components/Title';
import CarCard from '../components/CarCard';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/ui/empty-state';
import { Alert } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/input';

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe'];

const Cars = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState(searchParams.get('location') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [total, setTotal] = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (input) params.search = input;
      if (locationFilter) params.location = locationFilter;
      if (category) params.category = category;
      params.limit = '50';

      const res = await api.get('/cars', { params });
      setCars(res.data.data.cars ?? []);
      setTotal(Number(res.data.data.total ?? 0));
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.error || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, [input, category, locationFilter]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  if (loading) {
    return (
      <div className='px-6 md:px-12 py-20 bg-background'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles.' />
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-12'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className='flex flex-col h-[420px]'>
              <Skeleton className='h-48 w-full rounded-xl mb-4' />
              <Skeleton className='h-4 w-32 mb-2' />
              <Skeleton className='h-3 w-24 mb-1' />
              <Skeleton className='h-3 w-48' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='px-6 md:px-12 py-16 bg-background min-h-[calc(100vh-200px)]'>
      <div className='max-w-7xl mx-auto'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure.' align='left' />
        {error && <Alert variant='error' title='Unable to load cars'>{error}</Alert>}

        <div className='bg-surface border border-border rounded-2xl p-6 mb-10 shadow-soft'>
          <form onSubmit={(e) => { e.preventDefault(); fetchCars(); }} className='flex flex-col sm:flex-row gap-4 items-start sm:items-end'>
            <div className='flex-1 min-w-0'>
              <Input
                label='Search'
                placeholder='Make, model, brand, or location'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='w-full'
              />
            </div>
            <div className='flex-1 min-w-0 sm:w-64'>
              <Select
                label='Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <div className='flex-1 min-w-0 sm:w-64'>
              <Select
                label='Location'
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value=''>All locations</option>
                {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Select>
            </div>
            <Button type='submit' className='w-full sm:w-auto'>Apply filters</Button>
          </form>
        </div>

        <div className='flex items-center justify-between mb-6'>
          <p className='text-body-sm text-text-muted'>Showing {cars.length} of {total} vehicles</p>
        </div>

        {cars.length === 0 ? (
          <EmptyState
            title='No vehicles found'
            description='Try adjusting your search or filters to see more options.'
            actionLabel='Clear filters'
            onAction={() => {
              setInput('');
              setLocationFilter('');
              setCategory('');
            }}
          />
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
            {cars.map((car) => (
              <div key={car._id} className=''>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
