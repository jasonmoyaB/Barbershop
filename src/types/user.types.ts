export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};

export type UserRole = 'admin' | 'user';
