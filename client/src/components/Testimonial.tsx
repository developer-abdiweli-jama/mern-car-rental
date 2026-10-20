import Title from './Title';

const highlights = [
  {
    title: 'Check availability',
    description: 'Choose your pickup and return dates, then check whether a vehicle is available for your trip.',
  },
  {
    title: 'See daily pricing',
    description: 'Compare vehicle rates before booking. Your final rental total is calculated from the selected dates.',
  },
  {
    title: 'Manage your bookings',
    description: 'Review your reservations in one place and cancel eligible bookings from your account.',
  },
];

const Testimonial = () => (
  <section className='py-20 px-6 md:px-12 bg-muted'>
    <Title title='A simpler way to rent' subTitle='Hirgal Car Rental gives you the tools to find, book, and manage your next drive.' />
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto px-4 sm:px-0'>
      {highlights.map((highlight) => (
        <div key={highlight.title} className='bg-surface p-8 rounded-2xl border border-border shadow-soft'>
          <h3 className='text-h3 font-semibold text-text mb-3'>{highlight.title}</h3>
          <p className='text-body-sm text-text-muted leading-relaxed'>{highlight.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonial;
