export type UserRole = 'ADMIN' | 'LAWYER' | 'USER';

export interface UserPayload {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  empresa_id: string;
  avatar_url?: string | null;
  created_at?: string;
}