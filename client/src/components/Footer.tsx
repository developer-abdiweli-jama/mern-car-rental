import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import BrandLogo from './BrandLogo';

const socialLinks = [
  { name: 'Facebook', href: '#', src: assets.facebook_logo },
  { name: 'Instagram', href: '#', src: assets.instagram_logo },
  { name: 'X (Twitter)', href: '#', src: assets.twitter_logo },
];

const footerLinks = {
  'Quick Links': [
    { name: 'Home', path: '/' },
    { name: 'Browse Cars', path: '/cars' },
    { name: 'My Bookings', path: '/my-bookings' },
  ],
  'For Owners': [
    { name: 'List Your Car', path: '/owner/add-car' },
    { name: 'Manage Cars', path: '/owner/manage-cars' },
    { name: 'Manage Bookings', path: '/owner/manage-bookings' },
  ],
  'Resources': [
    { name: 'Help Center', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Insurance', href: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className='border-t border-border bg-surface mt-auto'>
      <div className='container py-10 md:py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>
          <div className='col-span-1 lg:col-span-1'>
            <Link to='/' aria-label='Hirgal Car Rental home' className='inline-flex mb-4'>
              <BrandLogo className='text-base sm:text-lg' />
            </Link>
            <p className='text-body-sm text-text-muted max-w-xs'>
              Premium car rental service with a wide selection of vehicles for every journey.
            </p>
            <div className='flex items-center gap-3 mt-6'>
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} target='_blank' rel='noopener noreferrer' aria-label={s.name} className='p-2 text-text-muted hover:text-text transition-colors'>
                  <img src={s.src} alt={s.name} className='w-5 h-5' />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className='lg:col-span-1'>
              <h3 className='text-body-sm font-semibold text-text tracking-tight uppercase mb-4'>{title}</h3>
              <ul className='space-y-2'>
              {links.map((item) => (
                <li key={item.name}>
                  {'path' in item ? (
                    <Link to={item.path} className='text-body-sm text-text-muted hover:text-primary transition-colors'>
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.href} className='text-body-sm text-text-muted hover:text-primary transition-colors'>
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
              </ul>
            </div>
          ))}
        </div>
        <div className='border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-body-sm text-text-muted'>
            © {new Date().getFullYear()} Hirgal Car Rental. All rights reserved.
          </p>
          <ul className='flex items-center gap-6 text-body-sm'>
            <li><a href='#' className='text-text-muted hover:text-primary transition-colors'>Privacy</a></li>
            <li><a href='#' className='text-text-muted hover:text-primary transition-colors'>Terms</a></li>
            <li><a href='#' className='text-text-muted hover:text-primary transition-colors'>Cookies</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
