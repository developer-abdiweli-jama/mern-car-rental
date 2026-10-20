import { assets } from '../assets/assets';
import Title from './Title';

const testimonials = [
  {
    name: 'Emma Rodriguez',
    location: 'Barcelona, Spain',
    image: assets.testimonial_image_1,
    testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional. The vehicle was immaculate and the handoff was seamless.",
  },
  {
    name: 'Liam Johnson',
    location: 'New York, USA',
    image: assets.testimonial_image_2,
    testimonial: 'CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!',
  },
  {
    name: 'Sophia Lee',
    location: 'Seoul, South Korea',
    image: assets.testimonial_image_1,
    testimonial: 'I highly recommend CarRental! Their fleet is amazing, and I always feel like I am getting excellent service at a fair price.',
  },
];

const Testimonial = () => (
  <section className='py-20 px-6 md:px-12 bg-muted'>
    <Title title='What our customers say' subTitle='Discover why travelers choose CarRental for their journeys around the world.' />
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto px-4 sm:px-0'>
      {testimonials.map((testimonial, index) => (
        <div key={index} className='bg-surface p-8 rounded-2xl border border-border shadow-soft'>
          <div className='flex items-center gap-4 mb-6'>
            <img className='w-12 h-12 rounded-full object-cover' src={testimonial.image} alt={testimonial.name} />
            <div>
              <p className='text-body-sm font-semibold text-text'>{testimonial.name}</p>
              <p className='text-caption text-text-muted'>{testimonial.location}</p>
            </div>
          </div>
          <div className='flex items-center gap-1 mb-6'>
            {[1, 2, 3, 4, 5].map((star) => (
              <img key={star} src={assets.star_icon} alt='rating star' className='w-5 h-5 text-primary' />
            ))}
          </div>
          <p className='text-body-sm text-text-muted leading-relaxed'>"{testimonial.testimonial}"</p>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonial;
