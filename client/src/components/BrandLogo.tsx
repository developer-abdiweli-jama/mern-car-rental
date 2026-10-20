type BrandLogoProps = {
  className?: string;
};

const BrandLogo = ({ className = '' }: BrandLogoProps) => (
  <span
    role='img'
    aria-label='Hirgal Car Rental'
    className={`inline-flex items-center gap-2 whitespace-nowrap font-bold leading-none tracking-tight ${className}`}
  >
    <svg className='h-[1.4em] w-[1.4em] shrink-0' viewBox='0 0 64 64' aria-hidden='true' focusable='false'>
      <rect width='64' height='64' rx='16' fill='#0f172a' />
      <path d='M18 18v28M18 32h28' fill='none' stroke='#fff' strokeWidth='7' strokeLinecap='round' />
      <path d='M46 18v28' fill='none' stroke='#b45309' strokeWidth='7' strokeLinecap='round' />
    </svg>
    <span className='text-text'>Hirgal Car</span>
    <span className='-ml-1.5 text-primary'>Rental</span>
  </span>
);

export default BrandLogo;
