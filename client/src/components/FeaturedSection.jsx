import { useEffect, useState } from 'react';
import Title from './Title';
import { assets } from '../assets/assets';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/cars', { params: { limit: 6, sort: 'price_asc' } })
      .then(({ data }) => {
        if (active) setCars(data.data.cars);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
      
      <div >
          <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles available for your next adventure.'/>
      </div>
      {loading && <p className='mt-8 text-gray-500' role='status'>Loading featured vehicles...</p>}
      {!loading && loadError && (
        <p className='mt-8 text-center text-gray-600' role='alert'>Featured vehicles could not be loaded. Please try the cars page again in a moment.</p>
      )}
      {!loading && !loadError && cars.length === 0 && (
        <p className='mt-8 text-gray-500'>No vehicles are available yet.</p>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {
          cars.map((car)=>(
            <div key={car._id} className="">
              <CarCard car={car}/>
            </div>
          ))
        }
      </div>
      <button onClick={()=> {
        navigate('/cars');scrollTo(0,0);
      }} 
      className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md cursor-pointer '>
        Explore all cars <img src={assets.arrow_icon} alt='Arrow'/>
      </button>
    </div>
  );
};

export default FeaturedSection
