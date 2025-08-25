import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'default';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  active, 
  onClick, 
  variant = 'default',
  className,
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none transition-colors';
  const activeStyles = active ? 'bg-gray-200 font-semibold' : '';
  const variantStyles = variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const finalClassName = className || `${baseStyles} ${activeStyles} ${variantStyles} ${disabledStyles}`;
  
  return (
    <button
      type={type}
      className={finalClassName}
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof children === 'string' ? children : 'Button'}
    >
      {children}
    </button>
  );
};

export default Button;