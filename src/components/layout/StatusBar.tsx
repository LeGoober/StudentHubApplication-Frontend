import React from 'react';

interface StatusBarProps {
  onlineCount?: number;
  serverStatus?: 'online' | 'maintenance' | 'offline';
  lastActivity?: Date | string;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  onlineCount = 0, 
  serverStatus = 'online', 
  lastActivity 
}) => {
  const statusColors = {
    online: 'bg-green-500',
    maintenance: 'bg-yellow-500',
    offline: 'bg-red-500'
  };

  const statusLabels = {
    online: 'Online',
    maintenance: 'Maintenance',
    offline: 'Offline'
  };

  const formatLastActivity = (activity: Date | string | undefined) => {
    if (!activity) return null;
    
    try {
      const date = activity instanceof Date ? activity : new Date(activity);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting last activity:', error);
      return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white px-4 py-2 border-t border-gray-700">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${statusColors[serverStatus]}`}></div>
            <span>Server: {statusLabels[serverStatus]}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{onlineCount} online</span>
          </div>
        </div>

        {formatLastActivity(lastActivity) && (
          <div className="text-gray-400">
            Last activity: {formatLastActivity(lastActivity)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;