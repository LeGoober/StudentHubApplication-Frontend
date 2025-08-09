// @ts-ignore
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      className={`px-2 py-1 rounded ${active ? 'bg-gray-200 font-semibold' : 'bg-transparent'} hover:bg-gray-200 hover:font-medium ${children === 'Add Friend' ? 'bg-green-600 text-white font-semibold' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;