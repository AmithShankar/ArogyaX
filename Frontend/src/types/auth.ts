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
  isInitialLogin: boolean;
  
  // Actions
  setInitialLogin: (value: boolean) => void;
  setUser: (user: User | null) => void;
  hydrate: (force?: boolean) => Promise<void>;
  login: (phone: string, password: string) => Promise<{
    success: boolean;
    needsPasswordChange: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string, router: any) => Promise<void>;
}
