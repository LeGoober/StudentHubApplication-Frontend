import React from 'react';

const FriendsIcon = (
  <svg className="w-6 h-6" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path fill="currentColor" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" />
  </svg>
);

interface DiscordNavButtonProps {
  children: React.ReactNode;
  active?: boolean;
  variant?: 'primary' | 'default';
  onClick?: () => void;
}

const DiscordNavButton: React.FC<DiscordNavButtonProps> = ({ 
  children, 
  active = false, 
  variant = 'default',
  onClick 
}) => {
  const className = `discord-nav-button ${active ? 'active' : ''} ${variant === 'primary' ? 'primary' : ''}`;
  
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

const NavBar: React.FC = () => {
  return (
    <nav className="discord-nav">
      <div className="discord-nav-left">
        <div className="discord-nav-section">
          {FriendsIcon}
          <p>Friends</p>
        </div>
        <div className="discord-nav-buttons">
          <DiscordNavButton active={true}>Online</DiscordNavButton>
          <DiscordNavButton>All</DiscordNavButton>
          <DiscordNavButton>Pending</DiscordNavButton>
          <DiscordNavButton>Blocked</DiscordNavButton>
          <DiscordNavButton variant="primary">Add Friend</DiscordNavButton>
        </div>
      </div>
      <div className="discord-nav-icons">
        <i className="fa-solid fa-comment"></i>
        <i className="fa-solid fa-inbox"></i>
        <i className="fa-solid fa-circle-question"></i>
      </div>
    </nav>
  );
};

export default NavBar;