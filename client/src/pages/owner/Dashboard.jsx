import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import api from '../../api/axios'

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  const dashboardCards = [
    { title: 'Total Cars', value: stats.totalCars, icon: assets.carIconColored },
    { title: 'Total Bookings', value: stats.totalBookings, icon: assets.listIconColored },
    { title: 'Pending', value: stats.pendingBookings, icon: assets.cautionIconColored },
    { title: 'Confirmed', value: stats.confirmedBookings, icon: assets.listIconColored },
  ]

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await api.get('/bookings/owner')
      const bookings = res.data.data.bookings || []
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const monthlyRevenue = bookings
        .filter((b) => b.status === 'confirmed' && new Date(b.createdAt) >= monthStart)
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)

      setStats({
        totalCars: bookings.reduce((s, b) => s + (b.car ? 1 : 0), 0),
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
        confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
        recentBookings: bookings.slice(0, 5),
        monthlyRevenue,
      })
    } catch (err) {
      console.error('Failed to load dashboard stats', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 flex-1'>
        <Title title='Admin Dashboard' subTitle='Monitor overall platform performance' />
        <div className='animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary mt-10'></div>
      </div>
    )
  }

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title title='Admin Dashboard' subTitle='Monitor overall platform performance including cars, bookings, revenue, and recent activities' />
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-4xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex items-center gap-3 p-4 bg-white rounded-md border border-borderColor'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt={card.title} className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-xs text-gray-500'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500 text-sm'>Latest customer bookings</p>
          {stats.recentBookings.length === 0 ? (
            <p className='mt-4 text-gray-500 text-sm'>No recent bookings.</p>
          ) : (
            stats.recentBookings.map((booking, index) => (
              <div key={index} className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                    <img src={assets.listIconColored} className='h-5 w-5' alt='' />
                  </div>
                  <div>
                    <p className='font-medium text-sm'>{booking.car?.brand} {booking.car?.model}</p>
                    <p className='text-xs text-gray-500'>{new Date(booking.createdAt).toISOString().split('T')[0]}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <p className='text-gray-500'>{currency} {booking.totalPrice}</p>
                  <p className={`px-2 py-0.5 border border-borderColor rounded-full text-xs ${booking.status === 'confirmed' ? 'text-green-700 bg-green-50' : 'text-gray-600'}`}>{booking.status}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className='p-4 md:p-6 mb-6 border border-borderColor rounded-md md:max-w-xs w-full'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500 text-sm'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>{currency} {stats.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
