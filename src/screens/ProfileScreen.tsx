import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfile } from '../services/api';
import { setProfile } from '../store/slices/profileSlice';
import { RootState } from '../store';

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

  return (
    <div className="discord-main-content">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="discord-avatar-wrapper mb-6" style={{ width: '120px', height: '120px' }}>
          <img 
            src="/Assets/img-icon-profile.jpeg" 
            alt="Profile" 
            className="discord-avatar border-8 border-var(--discord-primary)" 
            style={{ width: '120px', height: '120px' }}
          />
          <div className="discord-status-indicator" style={{ width: '24px', height: '24px', bottom: '8px', right: '8px' }}></div>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-var(--discord-text-primary)">User Profile</h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : profile ? (
          <div className="w-full space-y-4">
            <div className="discord-profile-field">
              <label className="block text-sm font-medium text-var(--discord-text-secondary) mb-1">
                Full Name
              </label>
              <div className="discord-profile-value">
                {profile.firstName} {profile.lastName}
              </div>
            </div>
            
            <div className="discord-profile-field">
              <label className="block text-sm font-medium text-var(--discord-text-secondary) mb-1">
                Email Address
              </label>
              <div className="discord-profile-value">
                {profile.email}
              </div>
            </div>
            
            <div className="discord-profile-field">
              <label className="block text-sm font-medium text-var(--discord-text-secondary) mb-1">
                Status
              </label>
              <div className="discord-profile-value flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Online
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-var(--discord-primary)"></div>
            <span className="ml-3 text-var(--discord-text-secondary)">Loading profile...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;