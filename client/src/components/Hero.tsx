import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Hero = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickupLocation) params.set('location', pickupLocation);
    if (pickupDate) params.set('pickupDate', pickupDate);
    if (returnDate) params.set('returnDate', returnDate);
    navigate(`/cars${params.size ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className='relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <img
          src={assets.main_car}
          alt=''
          className='w-full h-full object-cover'
          style={{ filter: 'brightness(0.55)' }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/20' />
      </div>

      <div className='relative z-10 px-6 md:px-12 max-w-4xl'>
        <span className='inline-block px-3 py-1 rounded-full bg-primary-light text-primary text-caption font-medium tracking-wide uppercase mb-6'>
          Premium fleet &mdash; available now
        </span>
        <h1 className='text-display-xl font-bold text-white mb-6 sm:text-display-lg'>
          Drive the journey you deserve.
        </h1>
        <p className='text-body text-white/90 max-w-lg mx-auto mb-10'>
          Discover curated vehicles with transparent pricing, flexible pickup, and seamless booking.
        </p>

        <form onSubmit={handleSearch} className='flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface/95 backdrop-blur rounded-2xl p-5 shadow-lg border border-white/20'>
          <Input
            label='Pickup location'
            placeholder='City or address'
            value={pickupLocation}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPickupLocation(e.target.value)}
          />
          <div className='flex flex-col gap-1'>
            <label className='sr-only'>Pickup date</label>
            <input
              type='date'
              value={pickupDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full sm:w-48 px-4 py-3 rounded-lg border border-border bg-white text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='sr-only'>Return date</label>
            <input
              type='date'
              value={returnDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setReturnDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='w-full sm:w-48 px-4 py-3 rounded-lg border border-border bg-white text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary'
            />
          </div>
          <Button type='submit' className='w-full sm:w-auto'>
            Search vehicles
          </Button>
        </form>

        <div className='mt-12 flex items-center justify-center gap-8 text-body-sm text-white/70'>
          <div className='flex items-center gap-2'>
            <span className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <img src={assets.check_icon} alt='' className='w-4 h-4' />
            </span>
            <span>Free cancellation</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <img src={assets.check_icon} alt='' className='w-4 h-4' />
            </span>
            <span>No hidden fees</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
              <img src={assets.check_icon} alt='' className='w-4 h-4' />
            </span>
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
