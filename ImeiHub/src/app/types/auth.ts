export type Role = 'owner' | 'seller';

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Propietario',
  seller: 'Vendedor'
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  ownerId?: string;
  storeName: string;
  stallNumber: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  iat: number;
  exp: number;
}
