import { RolePermissions, User } from "./user";

export interface AuthContextType {
  user: User | null;
  permissions: RolePermissions | null;
  login: (phone: string, password: string) => Promise<{
    success: boolean;
    needsPasswordChange: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  permissions: RolePermissions | null;
  isLoggingOut: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  hydrate: () => Promise<void>;
  login: (phone: string, password: string) => Promise<{
    success: boolean;
    needsPasswordChange: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string, router: any) => Promise<void>;
}
