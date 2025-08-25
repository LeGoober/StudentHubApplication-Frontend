import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      <div className="mt-4">
        <div className="w-16 h-1 bg-blue-500 mx-auto rounded"></div>
      </div>
    </div>
  );
};

export default AuthHeader;