import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { Card } from '../components/ui/card';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
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
    <div className='min-h-[calc(100vh-160px)] bg-background flex items-center justify-center px-6'>
      <Card padding='none' className='w-full max-w-md'>
        <div className='p-8 md:p-10 text-center'>
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
              error={error || undefined}
            />
            <Input
              label='Email'
              type='email'
              name='email'
              required
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
              error={error || undefined}
            />
            <Input
              label='Password'
              type='password'
              name='password'
              required
              minLength={8}
              value={form.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
              error={error || undefined}
            />
            <p className='text-caption text-text-muted'>Minimum 8 characters</p>
            <Select
              label='Register as'
              name='role'
              value={form.role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: e.target.value })}
            >
              <option value='customer'>Customer</option>
              <option value='owner'>Vehicle owner</option>
            </Select>
            <Button type='submit' isLoading={loading} className='w-full'>
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
  );
};

export default Register;
