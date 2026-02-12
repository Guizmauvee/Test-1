
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 bg-white border-2 border-black focus:outline-none focus:ring-0 placeholder:text-gray-400 text-black font-medium transition-colors ${className}`}
      {...props}
    />
  );
};
