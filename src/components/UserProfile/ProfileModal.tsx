import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { getProfile, updateProfile } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

interface UserProfileData {
  id: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userRole: 'STUDENT' | 'STAFF' | 'ADMIN';
  studentNumber?: string;
  staffNumber?: string;
  bio?: string;
  avatar?: string;
  joinedDate: string;
  status: 'online' | 'away' | 'busy' | 'invisible';
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
  isOwnProfile?: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  isOwnProfile = false
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    userFirstName: string;
    userLastName: string;
    bio: string;
    status: 'online' | 'away' | 'busy' | 'invisible';
  }>({
    userFirstName: '',
    userLastName: '',
    bio: '',
    status: 'online'
  });
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  // Load profile data
  useEffect(() => {
    if (!isOpen || !targetUserId) return;

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProfile(targetUserId);
        const profile = response.data;
        setProfileData(profile);
        
        if (isOwnProfile) {
          setEditForm({
            userFirstName: profile.userFirstName || '',
            userLastName: profile.userLastName || '',
            bio: profile.bio || '',
            status: profile.status || 'online'
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isOpen, targetUserId, isOwnProfile]);

  const handleSaveProfile = async () => {
    if (!targetUserId || !profileData) return;

    setIsLoading(true);
    try {
      await updateProfile(targetUserId, editForm);
      setProfileData(prev => prev ? { ...prev, ...editForm } : null);
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setEditForm({
        userFirstName: profileData.userFirstName || '',
        userLastName: profileData.userLastName || '',
        bio: profileData.bio || '',
        status: profileData.status || 'online'
      });
    }
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'invisible': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600 text-white';
      case 'STAFF': return 'bg-blue-600 text-white';
      case 'STUDENT': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const inputBgClass = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const borderClass = isDark ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : profileData ? (
          <>
            {/* Header */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-16 h-16 ${isDark ? 'bg-blue-600' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                      {profileData.userFirstName?.[0]}{profileData.userLastName?.[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(profileData.status)} border-2 ${isDark ? 'border-gray-800' : 'border-white'} rounded-full`}></div>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${textClass}`}>
                      {profileData.userFirstName} {profileData.userLastName}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(profileData.userRole)}`}>
                        {profileData.userRole}
                      </span>
                      {profileData.studentNumber && (
                        <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                          Student: {profileData.studentNumber}
                        </span>
                      )}
                      {profileData.staffNumber && (
                        <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                          Staff: {profileData.staffNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-2xl font-bold`}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.userFirstName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, userFirstName: e.target.value }))}
                          className={`w-full px-3 py-2 ${inputBgClass} ${borderClass} border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${textClass}`}
                        />
                      ) : (
                        <p className={textClass}>{profileData.userFirstName || 'Not set'}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.userLastName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, userLastName: e.target.value }))}
                          className={`w-full px-3 py-2 ${inputBgClass} ${borderClass} border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${textClass}`}
                        />
                      ) : (
                        <p className={textClass}>{profileData.userLastName || 'Not set'}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <p className={textClass}>{profileData.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className={`w-full px-3 py-2 ${inputBgClass} ${borderClass} border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${textClass}`}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className={textClass}>{profileData.bio || 'No bio available'}</p>
                  )}
                </div>

                {/* Status */}
                {isOwnProfile && (
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className={`w-full px-3 py-2 ${inputBgClass} ${borderClass} border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${textClass}`}
                      >
                        <option value="online">Online</option>
                        <option value="away">Away</option>
                        <option value="busy">Busy</option>
                        <option value="invisible">Invisible</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 ${getStatusColor(profileData.status)} rounded-full`}></div>
                        <span className={`capitalize ${textClass}`}>{profileData.status}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Joined Date */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Joined
                  </label>
                  <p className={textClass}>
                    {new Date(profileData.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {isOwnProfile && (
                <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textClass} px-4 py-2 rounded-md`}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6">
            <p className={textClass}>Profile not found.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
