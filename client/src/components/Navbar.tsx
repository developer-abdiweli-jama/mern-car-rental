import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/useAuth';
import { Button } from './ui/button';

const menuLinks = [
  { name: 'Home', path: '/' },
  { name: 'Cars', path: '/cars' },
];

const authLinks = [
  { name: 'My Bookings', path: '/my-bookings' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOwnerOrAdmin = user && (user.role === 'owner' || user.role === 'admin');

  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.focus();
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate('/');
    handleClose();
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('location', searchQuery);
    navigate(`/cars${params.toString() ? `?${params.toString()}` : ''}`);
    handleClose();
  };

  return (
    <nav className='border-b border-border bg-surface sticky top-0 z-40 shadow-soft' aria-label='Main navigation'>
      <div className='container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-0 py-3'>
        <Link to='/' className='flex items-center gap-2' aria-label='CarRental home'>
          <img src={assets.logo} alt='CarRental' className='h-8' />
        </Link>

        <div className='flex items-center gap-3 md:gap-6 w-full md:w-auto justify-end'>
          {user ? (
            <>
              {isOwnerOrAdmin && (
                <Link
                  to='/owner'
                  className='text-body-sm font-medium text-text-muted hover:text-primary transition-colors px-4 py-2 rounded-lg'
                >
                  Dashboard
                </Link>
              )}
              <div className='flex items-center gap-2'>
                <span className='hidden md:inline text-body-sm text-text-muted'>{user.name}</span>
                <Button variant='outline' size='sm' onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to='/login' className='text-body-sm font-medium text-text-muted hover:text-primary transition-colors px-4 py-2 rounded-lg'>
                Sign in
              </Link>
              <Button size='sm'>Create account</Button>
            </>
          )}
          <button
            ref={buttonRef}
            className='md:hidden inline-flex items-center justify-center p-2.5 text-text-muted hover:text-text hover:bg-muted rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            aria-expanded={open}
            aria-controls='mobile-menu'
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className='sr-only'>Open main menu</span>
            {open ? (
              <img src={assets.close_icon} alt='Close menu' className='w-6 h-6' />
            ) : (
              <img src={assets.menu_icon} alt='Open menu' className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          id='mobile-menu'
          className='fixed inset-0 z-50 bg-surface flex flex-col md:hidden'
          onKeyDown={handleKeyDown}
        >
          <div className='flex items-center justify-between px-6 py-4 border-b border-border'>
            <h2 className='text-body-sm font-semibold text-text'>Menu</h2>
            <button
              className='inline-flex items-center justify-center p-2 text-text-muted hover:text-text rounded-lg focus-visible:ring-2 focus-visible:ring-primary'
              onClick={handleClose}
            >
              <span className='sr-only'>Close menu</span>
              <img src={assets.close_icon} alt='' className='w-5 h-5' />
            </button>
          </div>
          <div className='flex-1 overflow-y-auto px-6 py-4 space-y-1'>
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className={`block px-4 py-3 rounded-lg text-body-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-light text-primary'
                    : 'text-text-muted hover:bg-muted hover:text-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className={`block px-4 py-3 rounded-lg text-body-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-light text-primary'
                    : 'text-text-muted hover:bg-muted hover:text-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className='p-6 border-t border-border'>
            <form onSubmit={handleSearchSubmit} className='flex gap-2'>
              <input
                className='flex-1 px-4 py-3 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary'
                placeholder='Search cars by location'
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              <Button type='submit'>Search</Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
