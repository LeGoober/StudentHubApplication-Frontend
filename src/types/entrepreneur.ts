// Types mapping the Java SpringBoot domain classes

export interface UserProduct {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  // add other fields as needed
}

export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN' | string;

export interface User {
  userId: number;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userPassword?: string;
  userRole?: UserRole;
  studentNumber?: string | null;
  staffNumber?: string | null;
  status?: string;
  isOnline?: boolean;
  avatar?: string;
  createdAt?: string; // ISO datetime
  lastSeen?: string; // ISO datetime
  entrepreneurProfile?: EntrepreneurUserProfile | null;
}

export interface EntrepreneurUserProfile {
  entrepreneurUserId: number; // maps to user_id in DB
  user?: User;
  isCommercePortfolioEnabled?: boolean;
  sessionUrl?: string | null;
  biography?: string | null;
  userProducts?: UserProduct[];
}

export default EntrepreneurUserProfile;
