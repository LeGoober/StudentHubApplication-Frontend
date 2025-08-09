// @ts-ignore
import React from 'react';
import Button from './Button';

const NavBar: React.FC = () => {
  return (
      <nav className="w-full p-3 border-b-2 border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-2 font-semibold text-base border-r border-gray-200 w-24">
            <svg className="linkButtonIcon_c91bad" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
              <path fill="currentColor" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z"></path>
            </svg>
            <p>Friends</p>
          </div>
          <div className="px-5 flex items-center justify-start gap-4">
            <Button active={true}>Online</Button>
            <Button>All</Button>
            <Button>Pending</Button>
            <Button>Blocked</Button>
            <Button>Add Friend</Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xl">
          <i className="fa-solid fa-comment text-gray-600 border-r border-gray-200 pr-4"></i>
          <i className="fa-solid fa-inbox text-gray-600"></i>
          <i className="fa-solid fa-circle-question text-gray-600"></i>
        </div>
      </nav>
  );
};

export default NavBar;