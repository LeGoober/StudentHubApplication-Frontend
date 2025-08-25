import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfile } from '../services/api';
import { setProfile } from '../store/slices/profileSlice';
import { RootState } from '../store';
import TopNavBar from '../components/layout/TopNavBar';
import UserAvatar from '../components/features/User/UserAvatar';
import UserStatus from '../components/features/User/UserStatus';
import StatusBar from '../components/layout/StatusBar';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const [error, setError] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (token && id) {
      getProfile(Number(id))
        .then((response) => {
          dispatch(setProfile(response.data));
        })
        .catch((error) => {
          setError('Failed to fetch profile');
          console.error('Failed to fetch profile:', error);
        });
    }
  }, [token, id, dispatch]);

  const handleOpenProfile = () => {
    setShowProfileModal(true);
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <TopNavBar 
        onOpenProfile={handleOpenProfile}
        onOpenSettings={handleOpenSettings}
      />
      
      {/* Main profile content */}
      <div className="flex-1 overflow-auto bg-gray-700 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
            
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="absolute -top-16 left-8">
                <div className="bg-gray-800 p-2 rounded-full">
                  <UserAvatar
                    userId={Number(id)}
                    userName={profile ? `${profile.firstName} ${profile.lastName}` : undefined}
                    size="xl"
                    showOnlineStatus
                    isOnline
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleEditProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mr-2"
                >
                  Edit Profile
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Share Profile
                </button>
              </div>

              {/* Profile content */}
              <div className="mt-12">
                {error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <span className="block sm:inline">{error}</span>
                  </div>
                ) : profile ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                          {profile.firstName} {profile.lastName}
                        </h1>
                        <div className="flex items-center space-x-4">
                          <UserStatus status="online" size="md" showLabel />
                          <span className="text-gray-400">User #{id}</span>
                        </div>
                      </div>

                      {/* About section */}
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Email Address
                            </label>
                            <div className="text-white bg-gray-600 px-3 py-2 rounded">
                              {profile.email}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Member Since
                            </label>
                            <div className="text-white bg-gray-600 px-3 py-2 rounded">
                              {new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                              Bio
                            </label>
                            <div className="text-white bg-gray-600 px-3 py-2 rounded">
                              CPUT student passionate about technology and learning.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats and Activity */}
                    <div className="space-y-6">
                      {/* Activity Stats */}
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Messages Sent</span>
                            <span className="text-white font-semibold">1,247</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Channels Joined</span>
                            <span className="text-white font-semibold">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Days Active</span>
                            <span className="text-white font-semibold">45</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-300">Joined #general</span>
                            <span className="text-gray-500 text-xs">2h ago</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-300">Updated status</span>
                            <span className="text-gray-500 text-xs">1d ago</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-300">Changed avatar</span>
                            <span className="text-gray-500 text-xs">3d ago</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                            Send Message
                          </button>
                          <button className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors">
                            Add Friend
                          </button>
                          <button className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors">
                            Block User
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <span className="text-gray-400">Loading profile...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar
        onlineCount={23}
        serverStatus="online"
        lastActivity={new Date()}
      />

      {/* Modal placeholders */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <p className="text-gray-600 mb-4">Profile settings modal content here.</p>
            <button
              onClick={() => setShowProfileModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">Settings modal content here.</p>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;