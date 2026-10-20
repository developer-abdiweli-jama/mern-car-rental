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
    <div className='min-h-[calc(100vh-160px)] bg-background flex items-center justify-center px-6'>
      <Card padding='none' className='w-full max-w-md'>
        <div className='p-8 md:p-10 text-center'>
          <h2 className='text-h2 font-bold text-text mb-2'>Welcome back</h2>
          <p className='text-body-sm text-text-muted mb-8'>Sign in to your account</p>
          {error && <Alert variant='error' title='Sign in failed'>{error}</Alert>}
          <form onSubmit={handleSubmit} className='space-y-4'>
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
              value={form.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
              error={error || undefined}
            />
            <Button type='submit' isLoading={loading} className='w-full'>
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
  );
};

export default Login;
