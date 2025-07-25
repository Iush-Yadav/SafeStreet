import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedDate: string;
  reportsCount: number;
  reputation: number;
  communitiesJoined: string[];
  achievements: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('safestreets_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo login - accept any email/password combination
      // In production, this would be replaced with actual Firebase auth
      if (email && password) {
        const demoUser: User = {
          id: `user-${Date.now()}`,
          email: email,
          name: email.split('@')[0], // Use email prefix as name
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          joinedDate: new Date().toISOString().split('T')[0],
          reportsCount: Math.floor(Math.random() * 20) + 1,
          reputation: Math.floor(Math.random() * 50) + 30,
          communitiesJoined: ['downtown-safety', 'school-zone-watchers'],
          achievements: ['First Report', 'Community Helper', 'Safety Advocate']
        };
        setUser(demoUser);
        localStorage.setItem('safestreets_user', JSON.stringify(demoUser));
      } else {
        throw new Error('Please enter both email and password');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Demo registration - replace with actual Firebase auth
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        joinedDate: new Date().toISOString().split('T')[0],
        reportsCount: 0,
        reputation: 0,
        communitiesJoined: [],
        achievements: ['New Member']
      };
      setUser(newUser);
      localStorage.setItem('safestreets_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('safestreets_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('safestreets_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};