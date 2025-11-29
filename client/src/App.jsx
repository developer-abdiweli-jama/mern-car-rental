// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';

const App = () => {
  const [showLogin, setShowLogin] = useState(false); // ← fixed: was missing useState call
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings/' element={<MyBookings />} />
      </Routes>
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;