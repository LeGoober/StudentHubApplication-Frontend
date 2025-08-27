import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getAllUsers, getChannels } from '../services/api';

interface SearchResult {
  id: string | number;
  type: 'channel' | 'user';
  name: string;
  description?: string;
  avatar?: string;
  status?: string;
  isOnline?: boolean;
  category?: string;
  isPrivate?: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelSelect?: (channelId: string | number) => void;
  onUserSelect?: (userId: string | number) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onChannelSelect,
  onUserSelect
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allChannels, setAllChannels] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { token } = useSelector((state: RootState) => state.auth);

  // Load all data when modal opens
  useEffect(() => {
    if (isOpen && token) {
      loadAllData();
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, token]);

  // Search when query changes
  useEffect(() => {
    if (query.trim()) {
      performSearch(query.trim());
    } else {
      setResults([]);
    }
  }, [query, allChannels, allUsers]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [channelsResponse, usersResponse] = await Promise.all([
        getChannels().catch(() => ({ data: [] })),
        getAllUsers().catch(() => ({ data: [] }))
      ]);
      
      setAllChannels(channelsResponse.data || []);
      setAllUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Failed to load search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search channels
    allChannels.forEach(channel => {
      const name = channel.name || channel.channelName || '';
      const description = channel.description || '';
      const category = channel.category || '';
      
      if (name.toLowerCase().includes(lowerQuery) || 
          description.toLowerCase().includes(lowerQuery) ||
          category.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: channel.id,
          type: 'channel',
          name: name,
          description: description,
          category: category,
          isPrivate: channel.isPrivate || false
        });
      }
    });

    // Search users
    allUsers.forEach(user => {
      const username = user.username || user.userEmail || '';
      const displayName = user.displayName || `${user.userFirstName || ''} ${user.userLastName || ''}`.trim();
      const email = user.email || user.userEmail || '';
      
      if (username.toLowerCase().includes(lowerQuery) || 
          displayName.toLowerCase().includes(lowerQuery) ||
          email.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: user.id || user.userId,
          type: 'user',
          name: displayName || username,
          description: `@${username}`,
          avatar: user.avatar,
          status: user.status,
          isOnline: user.online || user.isOnline
        });
      }
    });

    // Sort results: channels first, then users, both alphabetically
    searchResults.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'channel' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    setResults(searchResults.slice(0, 20)); // Limit to 20 results
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'channel' && onChannelSelect) {
      onChannelSelect(result.id);
    } else if (result.type === 'user' && onUserSelect) {
      onUserSelect(result.id);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div ref={modalRef} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search channels, users, and messages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading...</p>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <svg className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-400">No results found for "{query}"</p>
              <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {!loading && !query && (
            <div className="p-8 text-center">
              <svg className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-400">Search for channels and users</p>
              <p className="text-gray-500 text-sm mt-1">Start typing to see results</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {/* Channel Results */}
              {results.some(r => r.type === 'channel') && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Channels</h3>
                </div>
              )}
              
              {results.filter(r => r.type === 'channel').map(result => (
                <button
                  key={`channel-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex-shrink-0 mr-3 text-gray-400">
                    {result.isPrivate ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-lg font-bold">#</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{result.name}</p>
                    {result.description && (
                      <p className="text-gray-400 text-sm truncate">{result.description}</p>
                    )}
                    {result.category && (
                      <p className="text-gray-500 text-xs">{result.category}</p>
                    )}
                  </div>
                </button>
              ))}

              {/* User Results */}
              {results.some(r => r.type === 'user') && (
                <>
                  {results.some(r => r.type === 'channel') && (
                    <div className="border-t border-gray-700 my-2"></div>
                  )}
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Users</h3>
                  </div>
                </>
              )}
              
              {results.filter(r => r.type === 'user').map(result => (
                <button
                  key={`user-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex-shrink-0 mr-3">
                    {result.avatar ? (
                      <img 
                        src={result.avatar} 
                        alt={result.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {result.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {result.isOnline && (
                      <div className="absolute ml-5 -mt-2 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{result.name}</p>
                    <p className="text-gray-400 text-sm truncate">{result.description}</p>
                    {result.status && (
                      <p className="text-gray-500 text-xs truncate">{result.status}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-900 rounded-b-lg border-t border-gray-700">
          <div className="flex items-center text-xs text-gray-400">
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd>
            <span className="ml-2">to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
