export type User = {
  userId: number;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userPassword?: string;
  userRole?: string;
  studentNumber?: string | null;
  staffNumber?: string | null;
  status?: string;
  isOnline?: boolean;
  avatar?: string;
  createdAt?: string;
  lastSeen?: string;
};
