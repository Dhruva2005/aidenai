import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse } from '../types';
import { authAPI, userAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      userAPI.getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const loginData: LoginResponse = response.data;
      
      localStorage.setItem('token', loginData.token);
      
      const userData: User = {
        id: loginData.id,
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        role: loginData.role,
        leavesLeft: 0 // Will be updated by getCurrentUser
      };
      
      setUser(userData);
      
      // Get updated user info with leave balance
      const userResponse = await userAPI.getCurrentUser();
      setUser(userResponse.data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
