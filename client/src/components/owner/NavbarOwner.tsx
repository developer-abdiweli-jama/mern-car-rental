import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import BrandLogo from '../BrandLogo'

const NavbarOwner = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className='bg-white border-b border-borderColor px-4 py-3 flex items-center justify-between shadow-sm'>
      <Link to='/owner' aria-label='Hirgal Car Rental owner workspace' className='flex items-center gap-3'>
        <BrandLogo className='text-lg sm:text-xl' />
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
