import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './AuthService'; // Adjust the import path as necessary
import { JWTUtils } from './JWTUtils'; // Adjust the import path as necessary
import * as AuthService from './AuthService'; // Adjust the import path as necessary

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token && !JWTUtils.isTokenExpired(token)) {
          const fetchedUser = await AuthService.currentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
          }
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await AuthService.login(username, password);
      localStorage.setItem('token', token); // Store token in localStorage
      setUser(loggedInUser);
    } catch (err) {
      console.error('Login failed:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token'); // Remove token from localStorage
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err instanceof Error ? err.message : String(err));
      throw err;
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
