import type { Car } from '../types';
import { useEffect, useState } from 'react';
import Title from './Title';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Skeleton } from './ui/skeleton';
import { Alert } from './ui/alert';
import { EmptyState } from './ui/empty-state';
import { Button } from './ui/button';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/cars', { params: { limit: 6, sort: 'price_asc' } })
      .then(({ data }) => {
        if (active) setCars(data.data.cars ?? []);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <section className='py-20 px-6 md:px-12'>
        <Title title='Featured Vehicles' subTitle='Explore our curated selection of premium vehicles.' />
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-12'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='h-[420px] flex flex-col'>
              <Skeleton className='h-48 w-full rounded-xl mb-4' />
              <Skeleton className='h-4 w-32 mb-2' />
              <Skeleton className='h-3 w-24 mb-1' />
              <Skeleton className='h-3 w-48' />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className='py-20 px-6 md:px-12'>
      <Title title='Featured Vehicles' subTitle='Explore our curated selection of premium vehicles.' />
      {loadError && (
        <div className='mt-12'>
          <Alert variant='error' title='Unable to load featured vehicles'>
            Please try browsing all cars instead.
          </Alert>
        </div>
      )}
      {(!loading && !loadError && cars.length === 0) && (
        <div className='mt-12'>
          <EmptyState
            title='No featured vehicles yet'
            description='Check back soon for new additions to our fleet.'
            actionLabel='Browse all cars'
            onAction={() => { navigate('/cars'); window.scrollTo(0, 0); }}
          />
        </div>
      )}
      {!loading && !loadError && cars.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-12'>
          {cars.map((car) => (
            <div key={car._id} className=''>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}
      {!loading && !loadError && cars.length > 0 && (
        <div className='mt-10 flex justify-center'>
          <Button onClick={() => { navigate('/cars'); window.scrollTo(0, 0); }}>
            Explore all cars
          </Button>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
