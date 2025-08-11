import React from 'react';

interface SidebarProps {
    toggleSidebar: () => void;
}

const ServerIcon: React.FC<{ iconClass?: string; imageSrc?: string; onClick?: () => void; isPrimary?: boolean }> = ({ iconClass, imageSrc, onClick, isPrimary = false }) => {
    if (imageSrc) {
        return (
            <div className="discord-icon" onClick={onClick}>
                <img
                    src={imageSrc}
                    alt="server"
                    className="w-full h-full object-cover rounded-full hover:rounded-xl transition-all duration-300"
                />
            </div>
        );
    }

    return (
        <div className={`discord-icon ${isPrimary ? 'primary' : 'server'}`} onClick={onClick}>
            <i className={iconClass}></i>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
    return (
        <aside className="discord-aside">
            <ServerIcon iconClass="fa-brands fa-discord" onClick={toggleSidebar} isPrimary />
            <hr className="discord-hr" />
            <ServerIcon imageSrc="/Assets/Azaan.jpeg" />
            <ServerIcon iconClass="fa-solid fa-plus" />
            <ServerIcon iconClass="fa-solid fa-compass" />
            <hr className="discord-hr" />
            <ServerIcon iconClass="fa-solid fa-arrow-down" />
        </aside>
    );
};

export default Sidebar;