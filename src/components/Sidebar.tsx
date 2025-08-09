// @ts-ignore
import React from 'react';

interface SidebarProps {
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
    return (
        <aside className="w-[6%] p-3 bg-gray-300 flex flex-col items-center justify-start h-screen gap-2">
            <i className="fa-brands fa-discord text-2xl flex items-center justify-center p-3 text-white bg-blue-600 rounded-2xl w-12 h-12 cursor-pointer" onClick={toggleSidebar}></i>
            <hr className="w-1/2 rounded-full border border-gray-400" />
            <img src="/Assets/Azaan.jpeg" alt="profile" className="w-12 h-12 rounded-full cursor-pointer hover:rounded-2xl transition-all duration-300" />
            <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center text-xl cursor-pointer hover:bg-green-600 hover:text-white hover:rounded-2xl transition-all duration-300">
                <i className="fa-solid fa-plus"></i>
            </div>
            <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center text-xl cursor-pointer hover:bg-green-600 hover:text-white hover:rounded-2xl transition-all duration-300">
                <i className="fa-solid fa-compass"></i>
            </div>
            <hr className="w-1/2 rounded-full border border-gray-400" />
            <div className="w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center text-xl cursor-pointer hover:bg-green-600 hover:text-white hover:rounded-2xl transition-all duration-300">
                <i className="fa-solid fa-arrow-down"></i>
            </div>
        </aside>
    );
};

export default Sidebar;