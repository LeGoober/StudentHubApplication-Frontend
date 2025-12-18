import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import { getEntrepreneurStudent } from '../services/entrepreneur';
import type { EntrepreneurUserProfile } from '../types/entrepreneur';

const EntrepreneurUserProfileScreen: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EntrepreneurUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(userId);
    if (!id || Number.isNaN(id)) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEntrepreneurStudent(id);
        const data = (res as any)?.data;
        setProfile(data || null);
      } catch (err: any) {
        setError(err?.message || 'Failed to load entrepreneur profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const goToProducts = () => {
    if (!userId) return;
    navigate(`/entrepreneurs/${userId}/products`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopNavBar />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Entrepreneur Profile</h1>

        {loading && <div className="text-gray-600 dark:text-gray-300">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && profile && (
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {profile.user?.userFirstName} {profile.user?.userLastName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{profile.user?.userEmail}</div>
              </div>
              <button onClick={goToProducts} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                View Products
              </button>
            </div>

            {profile.biography && (
              <div className="mt-4">
                <div className="font-medium text-gray-900 dark:text-white mb-1">Biography</div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.biography}</p>
              </div>
            )}

            <div className="mt-4">
              <div className="font-medium text-gray-900 dark:text-white mb-1">Contact</div>
              <ul className="text-gray-700 dark:text-gray-300 text-sm">
                {profile.user?.userEmail && <li>Email: {profile.user.userEmail}</li>}
                {/* Placeholder for phone/contact details when available */}
                {profile.sessionUrl && (
                  <li>
                    Session: <a className="text-blue-600" href={profile.sessionUrl} target="_blank" rel="noreferrer">{profile.sessionUrl}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EntrepreneurUserProfileScreen;
