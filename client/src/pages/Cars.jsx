import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CarCard from '../components/CarCard';
import api from '../api/axios';

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe'];

const Cars = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState(searchParams.get('location') || searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState('');
  const [total, setTotal] = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (input) params.search = input;
      if (locationFilter) params.location = locationFilter;
      if (category) params.category = category;
      params.limit = 100;

      const res = await api.get('/cars', { params });
      setCars(res.data.data.cars);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error('Failed to load cars', err);
    } finally {
      setLoading(false);
    }
  }, [input, category, locationFilter]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  if (loading) {
    return (
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure' />

        <div className='flex items-center bg-white px-4 mt-4 max-w-2xl w-full h-12 rounded-full shadow flex-wrap gap-4 md:nowrap md:flex-no-wrap md:gap-0'>
          <img src={assets.search_icon} alt='search icon' className='w-4.5 h-4.5 mr-2' />
          <input
            onChange={(e) => {
              setInput(e.target.value);
              setLocationFilter('');
            }}
            value={input}
            type='text'
            placeholder='Search by make, model, brand, or location'
            className='w-full md:w-80 h-full text-gray-500 outline-none bg-transparent'
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='px-3 py-2 border border-borderColor rounded-md text-sm bg-transparent outline-none'
          >
            <option value=''>All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <img src={assets.filter_icon} alt='filter icon' className='w-4.5 h-4.5 ml-2 hidden md:block' />
        </div>
      </div>

      <div className='px-6 md:px-12 lg:px-24 -mt-10'>
        <div className='flex justify-between items-center mb-6'>
          <p className='text-gray-500'>Showing {cars.length} of {total} cars</p>
        </div>
        {cars.length === 0 ? (
          <p className='text-gray-500 text-center py-10'>No cars found matching your criteria.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-12 max-w-7xl mx-auto'>
            {cars.map((car) => (
              <div key={car._id} className=''>
                <CarCard
                  car={car}
                  pickupDate={searchParams.get('pickupDate')}
                  returnDate={searchParams.get('returnDate')}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
