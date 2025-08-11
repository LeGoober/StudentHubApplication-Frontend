import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'default';
}

const Button: React.FC<ButtonProps> = ({ children, active, onClick, variant = 'default' }) => {
  const baseStyles = 'px-2 py-1 rounded focus:outline-none';
  const activeStyles = active ? 'bg-gray-200 font-semibold' : 'bg-transparent';
  const variantStyles = variant === 'primary' ? 'bg-green-600 text-white font-semibold' : '';
  return (
    <button
      className={`${baseStyles} ${activeStyles} ${variantStyles} hover:bg-gray-200 hover:font-medium`}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : 'Button'}
    >
      {children}
    </button>
  );
};

export default Button;