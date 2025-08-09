// @ts-ignore
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import RightSideArea from './RightSideArea';

const Main: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        if (window.innerWidth < 750) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <main className="flex w-full">
            <Sidebar toggleSidebar={toggleSidebar} />
            <div className="flex w-full">
                <div className={`${isSidebarOpen ? 'block' : 'hidden'} w-[19%]`}>
                    <ChatSidebar />
                </div>
                <div className={`${isSidebarOpen ? 'hidden' : 'block'} w-[75%]`}>
                    <RightSideArea />
                </div>
            </div>
        </main>
    );
};

export default Main;