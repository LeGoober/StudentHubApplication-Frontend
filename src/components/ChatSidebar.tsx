import React from 'react';
import Profile from './Profile';

const FriendsIcon = (
  <svg className="w-6 h-6" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path fill="currentColor" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" />
  </svg>
);

const NitroIcon = (
  <svg className="w-6 h-6" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M15 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path fill="currentColor" fillRule="evenodd" d="M7 4a1 1 0 0 0 0 2h3a1 1 0 1 1 0 2H5.5a1 1 0 0 0 0 2H8a1 1 0 1 1 0 2H6a1 1 0 0 0 0 2h1.25A8 8 0 1 0 15 4H7Zm8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" clipRule="evenodd" />
    <path fill="currentColor" d="M2.5 10a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2h.5Z" />
  </svg>
);

const ShopIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path transform="translate(4, 0)" d="M12.3172 7.80738C12.4618 7.67827 12.591 7.54399 12.702 7.40972C13.4018 6.58082 13.7375 5.58924 13.8717 4.5202C13.9234 3.93145 13.944 3.20068 13.6703 2.54738C13.3889 2.00511 12.7201 1.79336 12.1778 2.07483C11.602 2.38728 11.1501 2.77461 10.7705 3.22134C10.7266 2.94246 10.6724 2.66358 10.6052 2.38728C10.3883 1.68491 10.1482 0.724321 9.50003 0.176888C8.12112 -0.618439 7.52204 1.47317 7.26124 2.38728C7.1941 2.66358 7.13987 2.94504 7.09597 3.2265C7.08306 3.21101 7.07015 3.19293 7.05466 3.17486C6.65699 2.73846 6.1328 2.22718 5.46658 1.98703C4.87525 1.82693 4.26843 2.17553 4.10833 2.76687C3.81137 3.94695 3.97922 4.99017 4.37172 6.05405C4.62478 6.72284 5.01986 7.33225 5.5518 7.8048C2.4712 7.90034 0 10.4283 0 13.5348V21H6.46849V16.4966C6.46849 15.159 7.55303 14.0745 8.89062 14.0745C10.2282 14.0745 11.3128 15.159 11.3128 16.4966V21H17.8613V13.5348C17.8613 10.4309 15.3953 7.90551 12.3147 7.80738H12.3172ZM4.54731 13.416C3.62029 13.416 2.87144 12.6646 2.87144 11.7401C2.87144 10.8157 3.62287 10.0643 4.54731 10.0643C5.47175 10.0643 6.22318 10.8157 6.22318 11.7401C6.22318 12.6646 5.47175 13.416 4.54731 13.416Z" fill="currentColor" />
  </svg>
);

interface DiscordListItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  badge?: {
    type: 'new' | 'buy';
    text: string;
  };
}

const DiscordListItem: React.FC<DiscordListItemProps> = ({ icon, text, active = false, badge }) => {
  return (
    <div className={`discord-list-item ${active ? 'active' : ''}`}>
      {icon}
      <p>{text}</p>
      {badge && (
        <div className={`discord-badge ${badge.type}`}>
          {badge.text}
        </div>
      )}
    </div>
  );
};

interface DiscordFriendItemProps {
  imgSrc: string;
  name: string;
  isOnline?: boolean;
}

const DiscordFriendItem: React.FC<DiscordFriendItemProps> = ({ imgSrc, name, isOnline = true }) => {
  return (
    <div className="discord-friend-item">
      <div className="discord-avatar-wrapper">
        <img src={imgSrc} alt={`${name}'s avatar`} className="discord-avatar" />
        {isOnline && <div className="discord-status-indicator"></div>}
      </div>
      <p>{name}</p>
      <i className="fa-solid fa-times absolute right-2 top-1/2 transform -translate-y-1/2 text-xs opacity-0 group-hover:opacity-100"></i>
    </div>
  );
};

const ChatSidebar: React.FC = () => {
  return (
    <div className="h-full">
      <div className="discord-search-bar">
        <input className="discord-search-input" type="text" placeholder="Find or start a conversation" />
      </div>
      
      <div className="discord-list">
        <DiscordListItem icon={FriendsIcon} text="Friends" active={true} />
        <DiscordListItem icon={NitroIcon} text="Nitro" badge={{ type: 'buy', text: 'BUY 1, GET 1' }} />
        <DiscordListItem icon={ShopIcon} text="Shop" badge={{ type: 'new', text: 'NEW' }} />
      </div>
      
      <div className="discord-dm-section">
        <h1 className="discord-dm-header">
          DIRECT MESSAGES 
          <i className="fa fa-plus"></i>
        </h1>
        <div className="discord-friends-list">
          <DiscordFriendItem imgSrc="/Assets/img-icon.png" name="Unknown_Inj3ctor" />
          <DiscordFriendItem imgSrc="/Assets/img-icon 1.png" name="nxn" />
          <DiscordFriendItem imgSrc="/Assets/img-icon 2.png" name="Moiz Hussain" />
          <DiscordFriendItem imgSrc="/Assets/img-icon 3.png" name="Gpro-fighter" />
          <DiscordFriendItem imgSrc="/Assets/img-icon 4.jpeg" name="Rorisang Makgana" />
        </div>
      </div>
      
      <Profile />
    </div>
  );
};

export default ChatSidebar;