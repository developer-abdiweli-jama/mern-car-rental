import * as React from 'react';

export type Variant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  title?: string;
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; icon: string }> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-800', icon: 'text-blue-500' },
  success: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-800', icon: 'text-green-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800', icon: 'text-amber-500' },
  error: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-800', icon: 'text-red-500' },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, className, children, ...props }, ref) => {
    const styles = variantStyles[variant];
    return (
      <div
        ref={ref}
        role='alert'
        className={`flex items-start gap-3 p-4 rounded-lg ${styles.bg} ${styles.border} ${className ?? ''}`}
        {...props}
      >
        <div className={`flex shrink-0 ${styles.icon} mt-0.5`} aria-hidden='true'>
          {variant === 'success' && <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' /></svg>}
          {variant === 'error' && <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' /></svg>}
          {variant === 'warning' && <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0a1 1 0 012 0zm-1-8a1 1 0 100-2a1 1 0 000 2z' clipRule='evenodd' /></svg>}
          {variant === 'info' && <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0a1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' /></svg>}
          {(variant === 'info') && <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0a1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' /></svg>}
        </div>
        <div className='flex-1'>
          {title && <h4 className={`font-semibold text-text ${styles.text}`}>{title}</h4>}
          {children && (title ? <p className={`mt-1 text-body-sm ${styles.text}`}>{children}</p> : <p className={`text-body-sm ${styles.text}`}>{children}</p>)}
        </div>
      </div>
    );
  },
);

Alert.displayName = 'Alert';
