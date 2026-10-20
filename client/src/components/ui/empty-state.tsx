import * as React from 'react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, actionLabel, onAction, icon, className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col items-center justify-center text-center py-20 px-6 ${className ?? ''}`} {...props}>
      {icon && <div className='mb-6 opacity-50'>{icon}</div>}
      <h3 className='text-h3 font-semibold text-text mb-2'>{title}</h3>
      {description && <p className='text-body-sm text-text-muted max-w-md mb-6'>{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className='inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-sm font-medium'>
          {actionLabel}
        </button>
      )}
    </div>
  ),
);

EmptyState.displayName = 'EmptyState';
