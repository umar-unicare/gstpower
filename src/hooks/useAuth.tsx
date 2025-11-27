/* eslint-disable no-useless-catch */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, User as ApiUser } from "@/lib/api";

interface User {
  id: number;
  email?: string;
  name: string;
  mobileNumber: string;
  profileImg?: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (mobileNumber: string, password: string) => Promise<boolean>;
  signup: (name: string, mobileNumber: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const profile = await authApi.getUserProfile(accessToken);
          setUser({
            id: profile.id,
            name: profile.name,
            mobileNumber: profile.mobileNumber,
            email: profile.email,
            profileImg: profile.profileImg,
            role: profile.roles,
          });
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    };
    loadUser();
  }, []);

  const login = async (mobileNumber: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(mobileNumber, password);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      const profile = await authApi.getUserProfile(response.accessToken);
      setUser({
        id: profile.id,
        name: profile.name,
        mobileNumber: profile.mobileNumber,
        email: profile.email,
        profileImg: profile.profileImg,
        role: profile.roles,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const signup = async (name: string, mobileNumber: string, password: string, email: string): Promise<boolean> => {
    try {
      await authApi.signup(name, mobileNumber, password, email);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token");
      
      const updatedProfile = await authApi.updateUser(accessToken, user.id, updates);
      setUser({
        id: updatedProfile.id,
        name: updatedProfile.name,
        mobileNumber: updatedProfile.mobileNumber,
        email: updatedProfile.email,
        profileImg: updatedProfile.profileImg,
        role: updatedProfile.roles,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};