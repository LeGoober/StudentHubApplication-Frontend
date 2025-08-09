// @ts-ignore
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProfile } from '../services/api';
import { setProfile } from '../store/slices/profileSlice';
import { RootState } from '../store';

const ProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    if (token && id) {
      getProfile(Number(id), token)
          .then((response) => {
            dispatch(setProfile(response.data));
          })
          .catch((error) => console.error('Failed to fetch profile:', error));
    }
  }, [token, id, dispatch]);

  return (
      <div className="flex flex-col items-center p-4 bg-gray-100 h-screen">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {profile ? (
            <div className="bg-white p-4 rounded shadow-md w-96">
              <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
        ) : (
            <p>Loading profile...</p>
        )}
      </div>
  );
};

export default ProfileScreen;