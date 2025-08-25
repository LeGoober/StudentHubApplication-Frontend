// User display utilities to handle different user object formats

interface UserData {
  id?: number;
  displayName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  email?: string;
  userRole?: string;
  role?: string;
  avatar?: string;
  online?: boolean;
  isOnline?: boolean;
}

/**
 * Get the display name for a user, handling various formats
 */
export const getUserDisplayName = (user?: UserData | null): string => {
  if (!user) return 'Unknown User';
  
  // Priority order:
  // 1. displayName (from auth response)
  // 2. firstName + lastName (legacy format)
  // 3. userFirstName + userLastName (profile API format)
  // 4. username or userEmail
  // 5. fallback to User #ID
  
  if (user.displayName) {
    return user.displayName;
  }
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  if (user.userFirstName && user.userLastName) {
    return `${user.userFirstName} ${user.userLastName}`;
  }
  
  if (user.username) {
    return user.username;
  }
  
  if (user.userEmail) {
    return user.userEmail;
  }
  
  if (user.email) {
    return user.email;
  }
  
  return `User #${user.id || 'Unknown'}`;
};

/**
 * Get the user's role in a consistent format
 */
export const getUserRole = (user?: UserData | null): string => {
  if (!user) return 'Student';
  
  const role = user.userRole || user.role || 'Student';
  
  // Convert to proper case
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

/**
 * Get user initials for avatar fallback
 */
export const getUserInitials = (user?: UserData | null): string => {
  if (!user) return 'U';
  
  const displayName = getUserDisplayName(user);
  
  // If it's just "User #X", return U + number
  if (displayName.startsWith('User #')) {
    const id = displayName.replace('User #', '');
    return `U${id}`;
  }
  
  // If it's an email, use first letter + @
  if (displayName.includes('@')) {
    return displayName.charAt(0).toUpperCase() + '@';
  }
  
  // Split by space and take first letter of first and last word
  const names = displayName.split(' ').filter(name => name.length > 0);
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  
  // Single name or word - take first 2 characters
  return displayName.substring(0, 2).toUpperCase();
};

/**
 * Get user avatar URL with fallback
 */
export const getUserAvatar = (user?: UserData | null): string | undefined => {
  if (!user) return undefined;
  
  return user.avatar;
};

/**
 * Check if user is online
 */
export const isUserOnline = (user?: UserData | null): boolean => {
  if (!user) return false;
  
  return user.online ?? user.isOnline ?? false;
};

/**
 * Format user for display in UI components
 */
export const formatUserForDisplay = (user?: UserData | null) => {
  return {
    id: user?.id,
    displayName: getUserDisplayName(user),
    role: getUserRole(user),
    initials: getUserInitials(user),
    avatar: getUserAvatar(user),
    isOnline: isUserOnline(user),
    email: user?.email || user?.userEmail
  };
};
