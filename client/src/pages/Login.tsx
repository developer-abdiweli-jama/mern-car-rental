import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { Card } from '../components/ui/card';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverMessage = (err as any)?.response?.data?.error;
      setError(serverMessage || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-160px)] bg-background px-4 py-12 sm:px-6'>
      <div className='mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface shadow-soft md:grid-cols-[0.9fr_1.1fr]'>
        <aside className='hidden flex-col justify-between bg-text p-10 text-white md:flex'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-white/70'>Hirgal Car Rental</p>
          <div><p className='mb-3 text-sm font-medium text-primary-light'>Your next journey starts here</p><h1 className='text-3xl font-semibold leading-tight'>The right car makes every trip better.</h1></div>
          <p className='text-sm text-white/65'>Browse trusted vehicles and manage every booking in one place.</p>
        </aside>
        <Card padding='none' className='w-full'>
        <div className='p-7 sm:p-10'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary'>Welcome back</p>
          <h2 className='text-h2 font-bold text-text mb-2'>Sign in to your account</h2>
          <p className='text-body-sm text-text-muted mb-8'>Sign in to continue to your account.</p>
          {error && <Alert variant='error' title='Sign in failed'>{error}</Alert>}
          <form onSubmit={handleSubmit} className='space-y-4'>
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
              value={form.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
            />
            <Button type='submit' isLoading={loading} className='mt-2 w-full'>
              Sign in
            </Button>
          </form>
          <p className='mt-8 text-body-sm text-text-muted'>
            Don't have an account?{' '}
            <Link to='/register' className='text-primary hover:text-primary-hover font-medium'>
              Create account
            </Link>
          </p>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
