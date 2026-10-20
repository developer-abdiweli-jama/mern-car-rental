import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Banner = () => (
  <section className='px-6 md:px-12 py-16'>
    <div className='max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border bg-gradient-to-b from-primary to-primary-hover shadow-lg'>
      <div className='grid md:grid-cols-2 gap-0 md:gap-0 items-center p-8 md:p-12'>
        <div className='px-4 md:px-12'>
          <h2 className='text-display-md font-bold text-white mb-4'>Own a luxury car?</h2>
          <p className='text-body text-white/90 mb-8 max-w-lg'>
            Monetize your vehicle effortlessly. We handle insurance, driver verification, and secure payments so you earn passive income, stress-free.
          </p>
          <Link to='/owner/add-car' className='inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-primary-light transition-colors'>
            List Your Car <img src={assets.arrow_icon} alt='' className='w-4 h-4' />
          </Link>
        </div>
        <div className='hidden md:block relative h-64'>
          <img
            src={assets.banner_car_image}
            alt='Luxury vehicle'
            className='w-full h-full object-cover opacity-90'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent' />
        </div>
      </div>
    </div>
  </section>
);

export default Banner;
