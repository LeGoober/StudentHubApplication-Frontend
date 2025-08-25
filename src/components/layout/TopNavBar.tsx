import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import UserAvatar from '../features/User/UserAvatar';
import SearchModal from '../SearchModal';
import { getUserDisplayName, getUserRole } from '../../utils/userDisplay';

interface TopNavBarProps {
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onChannelSelect?: (channelId: string | number) => void;
  onUserSelect?: (userId: string | number) => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onOpenProfile, onOpenSettings, onChannelSelect, onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<'online' | 'away' | 'busy' | 'invisible'>('online');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Temporary debugging to see user object structure
  React.useEffect(() => {
    if (user) {
      console.log('TopNavBar user object:', user);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    // Redirect will be handled by App.tsx routing
    window.location.href = '/auth';
  };

  const handleStatusChange = (status: 'online' | 'away' | 'busy' | 'invisible') => {
    setUserStatus(status);
    setIsDropdownOpen(false);
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    invisible: 'bg-gray-500'
  };

  return (
    <>
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
      {/* Left side - Logo/Brand */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">CPUT StudentHub</h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors pl-10 text-left"
          >
            <span className="text-gray-400">Search channels, users...</span>
          </button>
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div className="absolute right-3 top-2.5 text-xs text-gray-400 pointer-events-none">
            <kbd className="px-1.5 py-0.5 bg-gray-600 rounded text-xs">Ctrl K</kbd>
          </div>
        </div>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center space-x-4">
        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          title="Settings"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <div className="relative">
              <UserAvatar 
                userId={user?.id} 
                userName={getUserDisplayName(user)} 
                avatarUrl={user?.avatar}
                size="sm" 
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${statusColors[userStatus]}`}></div>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">
                {getUserDisplayName(user)}
              </div>
              <div className="text-xs text-gray-400">
                {getUserRole(user)}
              </div>
            </div>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-md shadow-lg border border-gray-700 z-50">
              <div className="py-2">
                {/* Status options */}
                <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">Set status</div>
                {(['online', 'away', 'busy', 'invisible'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 flex items-center space-x-2"
                  >
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
                    <span className="capitalize">{status}</span>
                    {userStatus === status && <span className="ml-auto text-green-500">✓</span>}
                  </button>
                ))}

                <div className="border-t border-gray-700 mt-2 pt-2">
                  <button
                    onClick={onOpenProfile}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 text-red-400"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onChannelSelect={onChannelSelect}
        onUserSelect={onUserSelect}
      />
    </>
  );
};

export default TopNavBar;