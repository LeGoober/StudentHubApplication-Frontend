/**
 * EntrepreneurProductsScreen - Catalog View
 * - Displays all entrepreneur students with their contact details and product catalogs
 * - Professional showcase format for each entrepreneur
 * - Product listings with prices (no cart functionality)
 * - Contact information for direct communication
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../store';
import { getEntrepreneurStudents } from '../services/entrepreneur';
import type { EntrepreneurUserProfile, UserProduct } from '../types/entrepreneur';
import TopNavBar from '../components/layout/TopNavBar';
import UserAvatar from '../components/features/User/UserAvatar';
import { useTheme } from '../contexts/ThemeContext';

const EntrepreneurProductsScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const token = useSelector((state: RootState) => state.auth.token);
    const [profiles, setProfiles] = useState<EntrepreneurUserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Optional filtering by entrepreneur userId via route state or query string
    const state = location.state as { userId?: number } | undefined;
    const queryParams = new URLSearchParams(location.search);
    const queryUserId = queryParams.get('userId');
    const filterUserId = state?.userId ?? (queryUserId ? Number(queryUserId) : undefined);

    const loadProfiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEntrepreneurStudents();
            const data = Array.isArray(res?.data) ? res.data : [];
            setProfiles(data as any);
        } catch (err: any) {
            console.error('Failed to load entrepreneur profiles', err);
            setError(err?.message || 'Failed to load profiles');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadProfiles(); }, [loadProfiles]);

    // Compute visible profiles based on optional filter
    const visibleProfiles = filterUserId
        ? profiles.filter(p => (p.user?.userId === filterUserId) || (p.entrepreneurUserId === filterUserId))
        : profiles;

    const formatPrice = (price?: number) => {
        if (price == null || price === 0) return 'Contact for pricing';
        return `R${price.toFixed(2)}`;
    };

    const handleContactEntrepreneur = (email?: string, sessionUrl?: string | null) => {
        if (sessionUrl) {
            window.open(sessionUrl, '_blank');
        } else if (email) {
            window.location.href = `mailto:${email}`;
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <TopNavBar />
            <main className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Entrepreneur Marketplace
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                        Discover innovative products and services from fellow student entrepreneurs
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className={`ml-3 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading entrepreneur catalogs...
                        </span>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button 
                            onClick={loadProfiles}
                            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && visibleProfiles.length === 0 && (
                    <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
                        <svg className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                            No Entrepreneurs Found
                        </h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Check back later for exciting new products and services!
                        </p>
                    </div>
                )}

                {/* Entrepreneur Catalogs - Minimal Mode */}
                {filterUserId ? (
                    (() => {
                        const profile = visibleProfiles[0];
                        return (
                            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                                {/* Compact Header */}
                                <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} px-6 py-4`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <UserAvatar
                                                userId={profile?.user?.userId}
                                                userName={`${profile?.user?.userFirstName ?? ''} ${profile?.user?.userLastName ?? ''}`.trim()}
                                                avatarUrl={profile?.user?.avatar}
                                                userRole="ENTREPRENEUR"
                                                size="lg"
                                                showOnlineStatus={false}
                                                showEntrepreneurBadge={true}
                                            />
                                            <div>
                                                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center space-x-2`}>
                                                    <span>{profile?.user?.userFirstName} {profile?.user?.userLastName}</span>
                                                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </h2>
                                                {profile?.user?.userEmail && (
                                                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{profile.user.userEmail}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleContactEntrepreneur(profile?.user?.userEmail, profile?.sessionUrl)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                            >
                                                {profile?.sessionUrl ? 'Schedule Meeting' : 'Contact'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Minimal Product List */}
                                <div className="p-6">
                                    {profile?.userProducts && profile.userProducts.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {profile.userProducts.map((product) => (
                                                <div key={product.id} className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
                                                    <div className="flex items-start justify-between">
                                                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.title || 'Untitled'}</h4>
                                                        <span className="text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}">{formatPrice(product.price)}</span>
                                                    </div>
                                                    {product.description && (
                                                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-2 line-clamp-3`}>{product.description}</p>
                                                    )}
                                                    <button
                                                        onClick={() => handleContactEntrepreneur(profile.user?.userEmail, profile.sessionUrl)}
                                                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                                                    >
                                                        Inquire
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No products available yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()
                ) : (
                    <div className="space-y-12">
                        {visibleProfiles.map((profile) => (
                            <div key={profile.entrepreneurUserId} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                                {/* Entrepreneur Header */}
                                <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} px-8 py-6 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-6">
                                            <div className="relative">
                                                <UserAvatar
                                                    userId={profile.user?.userId}
                                                    userName={`${profile.user?.userFirstName} ${profile.user?.userLastName}`}
                                                    avatarUrl={profile.user?.avatar}
                                                    userRole="ENTREPRENEUR"
                                                    size="xl"
                                                    showOnlineStatus={false}
                                                    showEntrepreneurBadge={true}
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold flex items-center space-x-2">
                                                    <span>
                                                        {profile.user?.userFirstName} {profile.user?.userLastName}
                                                    </span>
                                                    <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </h2>
                                                <p className="text-blue-100 mt-1">{profile.user?.userEmail}</p>
                                                {profile.biography && (
                                                    <p className="text-blue-50 mt-2 text-sm max-w-2xl">{profile.biography}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Contact Button */}
                                        <button
                                            onClick={() => handleContactEntrepreneur(profile.user?.userEmail, profile.sessionUrl)}
                                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>{profile.sessionUrl ? 'Schedule Meeting' : 'Contact'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Products Section */}
                                <div className="p-8">
                                    {profile.userProducts && profile.userProducts.length > 0 ? (
                                        <>
                                            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                                                <svg className="h-6 w-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                Products & Services ({profile.userProducts.length})
                                            </h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {profile.userProducts.map((product) => (
                                                    <div key={product.id} className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 hover:shadow-md transition-shadow`}>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h4 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                {product.title || 'Untitled Product'}
                                                            </h4>
                                                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        </div>
                                                        
                                                        {product.description && (
                                                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-3`}>
                                                                {product.description}
                                                            </p>
                                                        )}
                                                        
                                                        <button
                                                            onClick={() => handleContactEntrepreneur(profile.user?.userEmail, profile.sessionUrl)}
                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                            <span>Inquire</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No products available yet
                                            </p>
                                            <button
                                                onClick={() => handleContactEntrepreneur(profile.user?.userEmail, profile.sessionUrl)}
                                                className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                Contact for custom services
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default EntrepreneurProductsScreen;