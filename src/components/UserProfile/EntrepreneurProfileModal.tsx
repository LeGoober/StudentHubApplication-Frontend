import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { getProfile } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import UserAvatar from '../features/User/UserAvatar';
import { createUserProduct } from '../../services/userProduct';

interface EntrepreneurProfileData {
  id: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userRole: 'ENTREPRENEUR';
  bio?: string;
  avatar?: string;
  joinedDate: string;
  status: 'online' | 'away' | 'busy' | 'invisible';
  entrepreneurProfile?: {
    sessionUrl?: string;
    biography?: string;
    isCommercePortfolioEnabled?: boolean;
  };
}

interface EntrepreneurProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  isOwnProfile?: boolean;
}

const EntrepreneurProfileModal: React.FC<EntrepreneurProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  isOwnProfile = false
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [profileData, setProfileData] = useState<EntrepreneurProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen && userId) {
      loadProfile();
    }
  }, [isOpen, userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await getProfile(userId);
      setProfileData(response.data as EntrepreneurProfileData);
    } catch (error) {
      console.error('Failed to load entrepreneur profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProducts = () => {
    navigate('/entrepreneur-products');
    onClose();
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-6 py-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Entrepreneur Profile
            </h2>
            <button
              onClick={onClose}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : profileData ? (
            <div className="space-y-6">
              {/* Avatar and basic info */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <UserAvatar
                    userId={profileData.id}
                    userName={`${profileData.userFirstName} ${profileData.userLastName}`}
                    avatarUrl={profileData.avatar}
                    userRole={profileData.userRole}
                    size="xl"
                    showOnlineStatus={true}
                    showEntrepreneurBadge={true}
                    isOnline={profileData.status === 'online'}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center space-x-2`}>
                    <span>{profileData.userFirstName} {profileData.userLastName}</span>
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {profileData.userEmail}
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800`}>
                      Entrepreneur
                    </span>
                    <div className={`flex items-center space-x-1 ${profileData.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${profileData.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm capitalize">{profileData.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography */}
              {(profileData.bio || profileData.entrepreneurProfile?.biography) && (
                <div>
                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    About
                  </h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                    {profileData.entrepreneurProfile?.biography || profileData.bio}
                  </p>
                </div>
              )}

              {/* Session URL */}
              {profileData.entrepreneurProfile?.sessionUrl && (
                <div>
                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Session Link
                  </h4>
                  <a 
                    href={profileData.entrepreneurProfile.sessionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 text-sm underline"
                  >
                    {profileData.entrepreneurProfile.sessionUrl}
                  </a>
                </div>
              )}

              {/* Quick Add Product (visible to owner) */}
              {isOwnProfile && (
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Add a Product</h4>
                  <ProductQuickAdd userId={profileData.id} onSuccess={() => { loadProfile(); handleViewProducts(); }} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                {isOwnProfile ? (
                  // Own profile - edit buttons
                  <>
                    <button
                      onClick={handleEditProfile}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={handleViewProducts}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Manage Products</span>
                    </button>
                  </>
                ) : (
                  // Other user's profile - view products
                  <button
                    onClick={handleViewProducts}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>View Products</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Failed to load profile
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick add product form component
const ProductQuickAdd: React.FC<{ userId: number; onSuccess?: () => void }> = ({ userId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: any = {
        // Backends vary; send minimal fields present in types with a user link
        id: 0,
        title: title.trim(),
        description: description.trim(),
        price: price ? Number(price) : undefined,
        userId,
      };
      await createUserProduct(payload);
      setTitle('');
      setDescription('');
      setPrice('');
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Handmade Keychains"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Briefly describe your product"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Price (ZAR)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 199.99"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || title.trim().length === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default EntrepreneurProfileModal;
