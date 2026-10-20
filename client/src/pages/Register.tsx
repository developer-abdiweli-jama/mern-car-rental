import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { Card } from '../components/ui/card';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverMessage = (err as any)?.response?.data?.error;
      setError(serverMessage || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-160px)] bg-background px-4 py-12 sm:px-6'>
      <div className='mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-soft md:grid-cols-[0.9fr_1.1fr]'>
        <aside className='hidden flex-col justify-between bg-text p-10 text-white md:flex'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-white/70'>Hirgal Car Rental</p>
          <div><p className='mb-3 text-sm font-medium text-primary-light'>A smoother way to get around</p><h1 className='text-3xl font-semibold leading-tight'>Create your account and find your next ride.</h1></div>
          <p className='text-sm text-white/65'>Your bookings and trip details stay together in one place.</p>
        </aside>
        <Card padding='none' className='w-full'>
        <div className='p-7 sm:p-10'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>Get started</p>
          <h2 className='text-h2 font-bold text-text mb-2'>Create account</h2>
          <p className='text-body-sm text-text-muted mb-8'>Join Hirgal Car Rental today</p>
          {error && <Alert variant='error' title='Registration failed'>{error}</Alert>}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Full name'
              name='name'
              required
              value={form.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label='Email'
              type='email'
              name='email'
              required
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label='Password'
              type='password'
              name='password'
              required
              minLength={8}
              value={form.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
            />
            <Button type='submit' isLoading={loading} className='mt-2 w-full'>
              Create account
            </Button>
          </form>
          <p className='mt-8 text-body-sm text-text-muted'>
            Already have an account?{' '}
            <Link to='/login' className='text-primary hover:text-primary-hover font-medium'>
              Sign in
            </Link>
          </p>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
