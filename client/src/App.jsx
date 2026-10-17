// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to='/login' state={{ from: location }} replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const OwnerLayoutGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/cars' element={<Cars />} />
          <Route path='/car-details/:id' element={<CarDetails />} />
          <Route
            path='/my-bookings'
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route path='/owner' element={<OwnerLayoutGuard><Layout /></OwnerLayoutGuard>}>
            <Route index element={<ProtectedRoute roles={['owner', 'admin']}><Dashboard /></ProtectedRoute>} />
            <Route path='add-car' element={<ProtectedRoute roles={['owner', 'admin']}><AddCar /></ProtectedRoute>} />
            <Route path='manage-cars' element={<ProtectedRoute roles={['owner', 'admin']}><ManageCars /></ProtectedRoute>} />
            <Route path='manage-bookings' element={<ProtectedRoute roles={['owner', 'admin']}><ManageBookings /></ProtectedRoute>} />
          </Route>
        </Routes>
        <Footer />
    </AuthProvider>
  );
};

export default App;
