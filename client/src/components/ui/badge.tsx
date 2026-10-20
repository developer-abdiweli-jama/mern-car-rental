import * as React from 'react';

export type Variant = 'primary' | 'success' | 'warning' | 'error' | 'muted' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary-light text-primary border border-primary-light',
  success: 'bg-green-50 text-success border border-green-100',
  warning: 'bg-amber-50 text-warning border border-amber-100',
  error: 'bg-red-50 text-error border border-red-100',
  muted: 'bg-muted text-text-muted border border-border',
  outline: 'bg-transparent text-text border border-border',
};

const sizeStyles: Record<'sm' | 'md', string> = {
  sm: 'px-2 py-0.5 rounded text-caption font-medium',
  md: 'px-3 py-1 rounded-md text-body-sm font-medium',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'muted', size = 'md', className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1.5 ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';
