import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    full_name?: string;
    college_university?: string;
    degree_department?: string;
    current_year?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
  switchDemoUser: (role: 'student' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('opportunityai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session or default to student demo
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('opportunityai_token');
        if (storedToken) {
          try {
            const currentProfile = await api.getProfile();
            setProfile(currentProfile);
            setUser({
              id: currentProfile.user_id,
              email: currentProfile.email,
              role: currentProfile.role || 'student',
            });
            setIsLoading(false);
            return;
          } catch (e) {
            console.warn('Could not restore session, logging in demo student...', e);
          }
        }

        // Auto login demo student for seamless immediate evaluation
        await loginDemoStudent();
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginDemoStudent = async () => {
    try {
      const res = await api.login('student@demo.com', 'demo123');
      localStorage.setItem('opportunityai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    } catch (err) {
      console.warn('Fallback local student credentials');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('opportunityai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    full_name?: string;
    college_university?: string;
    degree_department?: string;
    current_year?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('opportunityai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('opportunityai_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data: Partial<StudentProfile>) => {
    const res = await api.updateProfile(data);
    setProfile(res.profile);
  };

  const switchDemoUser = async (role: 'student' | 'admin') => {
    setIsLoading(true);
    try {
      if (role === 'admin') {
        const res = await api.login('admin@demo.com', 'admin123');
        localStorage.setItem('opportunityai_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
      } else {
        const res = await api.login('student@demo.com', 'demo123');
        localStorage.setItem('opportunityai_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
