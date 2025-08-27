import React from 'react';

interface InputProps {
  id?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

const Input: React.FC<InputProps> = ({ 
  id,
  placeholder, 
  type = 'text', 
  value, 
  onChange, 
  onKeyPress,
  disabled = false,
  maxLength,
  className
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      disabled={disabled}
      maxLength={maxLength}
      className={className || "w-full p-2 rounded bg-gray-200 border-none outline-none disabled:opacity-50"}
      aria-label={placeholder || 'Input field'}
    />
  );
};

export default Input;