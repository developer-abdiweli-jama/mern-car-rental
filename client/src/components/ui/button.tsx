import * as React from 'react';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary active:scale-[0.98]',
  secondary: 'bg-surface text-text border border-border hover:bg-muted focus-visible:ring-border active:scale-[0.98]',
  outline: 'border border-border text-text hover:bg-muted focus-visible:ring-primary active:scale-[0.98]',
  ghost: 'text-text hover:bg-muted focus-visible:ring-primary active:scale-[0.98]',
  danger: 'bg-error text-white hover:bg-red-800 focus-visible:ring-error active:scale-[0.98]',
  success: 'bg-success text-white hover:bg-green-800 focus-visible:ring-success active:scale-[0.98]',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-3 py-1.5 text-body-sm',
  md: 'px-5 py-2.5 text-body',
  lg: 'px-8 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, isDisabled = false, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled || isDisabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg transition-all duration-200
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${className ?? ''}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <span className='sr-only'>Loading...</span>
            <svg className='w-4 h-4 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
            </svg>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
