import React, { useState } from 'react';
import ChannelInfoModal from '../ChannelInfoModal';

interface ChannelHeaderProps {
  channelName: string;
  channelId?: number;
  memberCount?: number;
  description?: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channelName, channelId, memberCount, description }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | undefined>();

  const handleChannelNameClick = (event: React.MouseEvent) => {
    if (channelId) {
      const rect = event.currentTarget.getBoundingClientRect();
      setModalPosition({
        x: rect.left + 10,
        y: rect.bottom + 10
      });
      setShowInfoModal(true);
    }
  };
  return (
    <div className="bg-gray-700 text-white px-4 py-3 border-b border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
          </svg>
          <div>
            <h2 
              className={`font-semibold text-lg ${channelId ? 'cursor-pointer hover:text-blue-300 transition-colors' : ''}`}
              onClick={handleChannelNameClick}
              title={channelId ? 'Click to view channel details' : ''}
            >
              #{channelName}
            </h2>
            {description && <p className="text-sm text-gray-400">{description}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {memberCount && (
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>{memberCount}</span>
            </div>
          )}
          
          <button className="p-2 rounded hover:bg-gray-600 transition-colors" title="Pin Messages">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          
          <button className="p-2 rounded hover:bg-gray-600 transition-colors" title="Notifications">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.46 3.46a4 4 0 010 5.66l-3.46 3.46a4 4 0 01-5.66 0l-3.46-3.46a4 4 0 010-5.66l3.46-3.46a4 4 0 015.66 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Channel Info Modal */}
      {channelId && (
        <ChannelInfoModal
          channelId={channelId}
          channelName={channelName}
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          position={modalPosition}
        />
      )}
    </div>
  );
};

export default ChannelHeader;