import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-light flex items-center justify-center'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow border border-borderColor'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Create Account</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
            <input
              name='name'
              required
              className='w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
              minLength={8}
              className='w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className='text-xs text-gray-500 mt-1'>Minimum 8 characters</p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Register as</label>
            <select
              name='role'
              className='w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value='customer'>Customer</option>
              <option value='owner'>Vehicle Owner</option>
            </select>
          </div>
          {error && <p className='text-sm text-red-600 text-center'>{error}</p>}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary disabled:bg-primary-dull text-white py-3 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed transition-all'
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='text-primary hover:underline font-medium'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
