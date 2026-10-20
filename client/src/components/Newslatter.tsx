import { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert } from './ui/alert';

const Newslatter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className='px-6 md:px-12 py-12 text-center'>
        <Alert variant='success' title='Thanks for subscribing!'>
          You will receive the latest offers and new arrivals.
        </Alert>
      </div>
    );
  }

  return (
    <section className='px-6 md:px-12 py-16 text-center'>
      <h2 className='text-display-md font-bold text-text mb-4'>Never miss a deal</h2>
      <p className='text-body-sm text-text-muted max-w-md mx-auto mb-10'>
        Subscribe to get the latest offers, new arrivals, and exclusive discounts.
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto'>
        <Input
          id='newsletter-email'
          label='Email address'
          placeholder='Enter your email'
          value={email}
          type='email'
          required
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className='w-full sm:w-80'
        />
        <Button type='submit' className='w-full sm:w-auto'>Subscribe</Button>
      </form>
    </section>
  );
};

export default Newslatter;
