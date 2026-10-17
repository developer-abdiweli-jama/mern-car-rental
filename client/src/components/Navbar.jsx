import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets, menuLinks } from '../assets/assets';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    const isOwnerOrAdmin = user && (user.role === 'owner' || user.role === 'admin');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className={`flex items-center justify-between px-6 md:px-12 py-4 text-gray-600 border-b border-borderColor relative bg-light`}>

            <Link to='/' className='flex items-center gap-2'>
                <img src={assets.logo} alt='Logo' className='h-8' />
            </Link>

            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 transition-transform duration-300 z-50 ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}>

                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path} onClick={() => setOpen(false)} className='text-sm sm:text-base hover:text-primary transition-colors'>
                        {link.name}
                    </Link>
                ))}

                <div className='hidden sm:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                    <input type='text' className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='Search cars' />
                    <img src={assets.search_icon} alt='search' />
                </div>

                <div className='flex items-center gap-4 sm:gap-6'>
                    {isOwnerOrAdmin ? (
                        <Link to='/owner' className='text-sm hover:text-primary transition-colors font-medium'>
                            Dashboard
                        </Link>
                    ) : null}

                    {user ? (
                        <div className='flex items-center gap-2 text-sm'>
                            <span className='text-gray-700 hidden sm:inline'>{user.name}</span>
                            <button onClick={handleLogout} disabled={loading} className='px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed'>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to='/login' className='px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg font-medium transition-colors'>
                                Login
                            </Link>
                            <Link to='/register' className='px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-lg font-medium text-gray-700 transition-colors'>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <button className='sm:hidden z-50' onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt='Menu' className='w-7 h-7' />
            </button>

            {open && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden' onClick={() => setOpen(false)} />
            )}
        </div>
    );
};

export default Navbar;
