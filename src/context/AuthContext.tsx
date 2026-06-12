import { createContext, useContext, useEffect, useState } from 'react';
import type { Models } from 'appwrite';
import { account } from '@/lib/appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  checkUserStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  checkUserStatus: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      setIsLoading(true);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      // User is not logged in or session expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, checkUserStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
