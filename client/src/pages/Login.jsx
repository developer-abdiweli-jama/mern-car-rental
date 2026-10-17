import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-light flex items-center justify-center'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow border border-borderColor'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Welcome Back</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              name='email'
              type='email'
              required
              className='w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input
              name='password'
              type='password'
              required
              className='w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <p className='text-sm text-red-600 text-center'>{error}</p>}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary disabled:bg-primary-dull text-white py-3 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed transition-all'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-600'>
          Don't have an account?{' '}
          <Link to='/register' className='text-primary hover:underline font-medium'>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
