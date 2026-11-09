import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  leftIcon,
  rightIcon,
  fullWidth,
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="spinner" aria-hidden="true" />
      )}
      {leftIcon && !loading && <span className="button-icon-left">{leftIcon}</span>}
      <span className="button-content">{children}</span>
      {rightIcon && !loading && <span className="button-icon-right">{rightIcon}</span>}
    </button>
  );
};

Button.displayName = 'Button';