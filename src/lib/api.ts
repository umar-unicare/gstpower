const BASE_URL = 'http://localhost:5000';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  name: string;
  mobileNumber: string;
  roles: 'SUPERADMIN' | 'ADMIN' | 'USER';
  email?: string;
  password?: string;
}

export const authApi = {
  login: async (mobileNumber: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, password }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  },

  signup: async (name: string, mobileNumber: string, password: string, email: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobileNumber, password, email }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
  },

  getUserProfile: async (accessToken: string): Promise<User> => {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  getAllUsers: async (accessToken: string): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  },

  updateUserRole: async (accessToken: string, mobileNumber: string, roles: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/update-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ mobileNumber, roles }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update role');
    }
  },
};
