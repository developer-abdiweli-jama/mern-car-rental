import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ padding = 'md', className, children, ...props }, ref) => {
    const paddingStyles: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    return (
      <div
        ref={ref}
        className={`
          bg-surface border border-border rounded-xl shadow-soft
          transition-shadow duration-200 hover:shadow-md
          ${paddingStyles[padding]}
          ${className ?? ''}
        `}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`mb-4 ${className ?? ''}`} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={`text-h2 font-semibold text-text ${className ?? ''}`} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className ?? ''} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`mt-4 flex items-center justify-between gap-3 ${className ?? ''}`} {...props}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
