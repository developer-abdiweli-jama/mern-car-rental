import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    if (status === 401) {
      // Session expired / unauthorized: clear local auth state is handled by context
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(err);
  }
);

export default api;
