import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@medicalerp.com',
    role: 'admin',
    name: 'John Admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'staff',
    email: 'staff@medicalerp.com',
    role: 'staff',
    name: 'Jane Staff',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    username: 'supplier',
    email: 'supplier@medicalerp.com',
    role: 'supplier',
    name: 'Bob Supplier',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('medicalerp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple authentication for demo
    const foundUser = mockUsers.find(u => u.username === username && password === 'password');
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('medicalerp_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicalerp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}