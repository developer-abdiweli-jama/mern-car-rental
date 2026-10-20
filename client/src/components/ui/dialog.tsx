import * as React from 'react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, title, description, children }: DialogProps) => {
  if (!open) return null;
  return (
    <>
      <div
        className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
        onClick={() => onOpenChange(false)}
        aria-hidden='true'
      />
      <div
        className='fixed left-[50%] top-[50%] z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-surface rounded-2xl border border-border shadow-lg p-6'
        role='dialog'
        aria-modal='true'
        aria-labelledby='dialog-title'
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 id='dialog-title' className='text-h2 font-semibold text-text mb-2'>{title}</h2>}
        {description && <p className='text-body-sm text-text-muted mb-6'>{description}</p>}
        <div className='flex items-center justify-end gap-3'>{children}</div>
      </div>
      <div className='fixed inset-0 z-40' onClick={() => onOpenChange(false)} />
    </>
  );
};

export interface DialogTriggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  triggerLabel?: string;
}

export const DialogTrigger = ({ open, onOpenChange, children, triggerLabel }: DialogTriggerProps) => {
  const cloned = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenChange(true);
      },
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
      ...(triggerLabel && { 'aria-label': triggerLabel }),
    });
  });
  return (
    <>
      {cloned}
      <Dialog open={open} onOpenChange={onOpenChange} />
    </>
  );
};
