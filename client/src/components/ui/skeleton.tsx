import * as React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  radius?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width = '100%', height = '1rem', radius = '0.375rem', className, ...props }, ref) => (
    <div
      ref={ref}
      role='status'
      aria-label='Loading'
      className={`animate-pulse rounded-${radius} bg-muted overflow-hidden w-full ${typeof width === 'number' ? `w-[${width}px]` : `w-${width}`} h-[${height}] ${className ?? ''}`}
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
