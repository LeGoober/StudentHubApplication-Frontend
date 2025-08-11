import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import RightSideArea from './RightSideArea';
import DiscordLoader from './DiscordLoader';

const Main: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (window.innerWidth < 750) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <>
      <DiscordLoader />
      <main className="flex w-full">
        <Sidebar toggleSidebar={toggleSidebar} />
        <div className={`discord-chat-sidebar ${!isSidebarOpen && window.innerWidth < 750 ? 'hidden' : 'block'}`} id="s">
          <ChatSidebar />
        </div>
        <div className={`discord-right-area ${isSidebarOpen && window.innerWidth < 750 ? 'hidden' : 'flex'}`} id="r">
          <RightSideArea />
        </div>
      </main>
    </>
  );
};

export default Main;