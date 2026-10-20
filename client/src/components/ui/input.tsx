import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  id?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, id, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className='flex flex-col gap-1' data-testid='input-wrapper'>
        {label && (
          <label htmlFor={inputId} className='text-body-sm font-medium text-text'>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? `${inputId}-desc` : undefined}
          className={`
            w-full px-4 py-3 rounded-lg border
            bg-surface text-text
            placeholder:text-text-muted
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${error ? 'border-error focus-visible:ring-error' : 'border-border'}
            ${className ?? ''}
          `}
          {...props}
        />
        {helper && (
          <p id={`${inputId}-desc`} className='text-caption text-text-muted'>
            {helper}
          </p>
        )}
        {error && (
          <p id={`${inputId}-desc`} className='text-caption text-error'>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  id?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, id, children, className, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    return (
      <div className='flex flex-col gap-1' data-testid='select-wrapper'>
        {label && (
          <label htmlFor={selectId} className='text-body-sm font-medium text-text'>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={`
            w-full px-4 py-3 rounded-lg border
            bg-surface text-text
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${error ? 'border-error focus-visible:ring-error' : 'border-border'}
            appearance-none
            bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.4%203.4%207.9%205.3%2012.8%205.3s9.4-1.9%2012.8-5.3L287%2095c3.5-3.5%205.4-8.2%205.4-12.8%200-4.6-1.9-9.3-5.5-12.8z%22/%3E%3C/svg%3E')]
            bg-no-repeat
            bg-right-3
            pr-11
            ${className ?? ''}
          `}
          {...props}
        >
          {children}
        </select>
        {helper && (
          <p id={`${selectId}-desc`} className='text-caption text-text-muted'>
            {helper}
          </p>
        )}
        {error && (
          <p id={`${selectId}-desc`} className='text-caption text-error'>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  id?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, id, className, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    return (
      <div className='flex flex-col gap-1' data-testid='textarea-wrapper'>
        {label && (
          <label htmlFor={textareaId} className='text-body-sm font-medium text-text'>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? `${textareaId}-desc` : undefined}
          className={`
            w-full px-4 py-3 rounded-lg border
            bg-surface text-text
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200 resize-none
            ${error ? 'border-error focus-visible:ring-error' : 'border-border'}
            ${className ?? ''}
          `}
          {...props}
        />
        {helper && (
          <p id={`${textareaId}-desc`} className='text-caption text-text-muted'>
            {helper}
          </p>
        )}
        {error && (
          <p id={`${textareaId}-desc`} className='text-caption text-error'>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
