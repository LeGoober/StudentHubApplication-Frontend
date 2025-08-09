// @ts-ignore
import React, { useEffect } from 'react';

const Loader: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.remove();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="loader" className="fixed top-0 left-0 w-full h-full bg-gray-100 flex flex-col items-center justify-center z-50">
      <i className="fa-brands fa-discord text-6xl text-gray-800 mb-8 animate-spin"></i>
      <h1 className="text-sm font-bold text-gray-900 mb-4">DID YOU KNOW</h1>
      <p className="text-base text-gray-700 flex flex-col items-center text-center gap-2">
        <span>
          <span className="px-3 py-1 rounded bg-gray-200 font-bold text-sm text-gray-900 mr-1">CTRL</span>
          <span className="px-3 py-1 rounded bg-gray-200 font-bold text-sm text-gray-900">K</span>
          to quickly find a previous
        </span>
        <span>conversation or channel.</span>
      </p>
    </div>
  );
};

export default Loader;