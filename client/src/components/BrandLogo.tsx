type BrandLogoProps = {
  className?: string;
};

const BrandLogo = ({ className = '' }: BrandLogoProps) => (
  <span
    role='img'
    aria-label='Hirgal Car Rental'
    className={`inline-flex items-baseline whitespace-nowrap font-bold leading-none tracking-tight ${className}`}
  >
    <span className='text-text'>Hirgal Car</span>
    <span className='ml-1.5 text-primary'>Rental</span>
  </span>
);

export default BrandLogo;
