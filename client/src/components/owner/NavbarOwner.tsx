import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/useAuth'

const NavbarOwner = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className='bg-white border-b border-borderColor px-4 py-3 flex items-center justify-between shadow-sm'>
      <Link to='/owner' className='flex items-center gap-2'>
        <img src={assets.logo} alt='CarRental' className='h-8' />
        <span className='font-medium text-gray-600 text-sm'>Owner workspace</span>
      </Link>
      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-600 hidden md:inline'>{user?.name}</span>
        <button onClick={handleLogout} className='text-sm text-red-600 hover:underline'>Logout</button>
      </div>
    </nav>
  )
}

export default NavbarOwner
