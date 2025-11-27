// const BASE_URL = 'http://localhost:5000';

// export interface LoginResponse {
//   accessToken: string;
//   refreshToken: string;
// }

// export interface User {
//   id: number;
//   name: string;
//   mobileNumber: string;
//   roles: 'SUPERADMIN' | 'ADMIN' | 'USER';
//   email?: string;
//   password?: string;
//   profileImg?: string | null; // ✅ Added profile image field
// }

// export const authApi = {
//   login: async (mobileNumber: string, password: string): Promise<LoginResponse> => {
//     const response = await fetch(`${BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ mobileNumber, password }),
//     });

//     if (!response.ok) {
//       throw new Error('Invalid credentials');
//     }

//     return response.json();
//   },

//   signup: async (name: string, mobileNumber: string, password: string, email: string): Promise<void> => {
//     const response = await fetch(`${BASE_URL}/auth/signup`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, mobileNumber, password, email }),
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error || 'Signup failed');
//     }
//   },

//   getUserProfile: async (accessToken: string): Promise<User> => {
//     const response = await fetch(`${BASE_URL}/user/profile`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch profile');
//     }

//     return response.json();
//   },

//   // ✅ Update user details and/or profile image
//   updateUserProfile: async (
//     accessToken: string,
//     userData: {
//       name: string;
//       email: string;
//       mobileNumber: string;
//       profileImgFile?: File | null;
//       removeProfileImg?: boolean;
//     }
//   ): Promise<void> => {
//     const formData = new FormData();
//     formData.append('mobileNumber', userData.mobileNumber);
//     formData.append('name', userData.name);
//     formData.append('email', userData.email);
//     formData.append('removeProfileImg', String(userData.removeProfileImg || false));
//     if (userData.profileImgFile) {
//       formData.append('profileImgFile', userData.profileImgFile);
//     }

//     const response = await fetch(`${BASE_URL}/user/edit`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error || 'Failed to update profile');
//     }
//   },

//   // ✅ Delete only profile image
//   deleteProfileImage: async (accessToken: string, mobileNumber: string): Promise<void> => {
//     const formData = new FormData();
//     formData.append('mobileNumber', mobileNumber);
//     formData.append('removeProfileImg', 'true');

//     const response = await fetch(`${BASE_URL}/user/edit`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Failed to delete profile image');
//     }
//   },

//     getAllUsers: async (accessToken: string): Promise<User[]> => {
//     const response = await fetch(`${BASE_URL}/user/all`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch users');
//     }
    
//     return response.json();
//   },

//   updateUserRole: async (accessToken: string, mobileNumber: string, roles: string): Promise<void> => {
//     const response = await fetch(`${BASE_URL}/auth/update-role`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({ mobileNumber, roles }),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to update role');
//     }
//   },

//     requestPasswordReset: async (email: string): Promise<void> => {
//     const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email }),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to send OTP');
//     }
//   },

//   resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
//     const response = await fetch(`${BASE_URL}/auth/reset-password`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, otp, newPassword }),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to reset password');
//     }
//   },

// };

const BASE_URL = 'https://api.powerfurnitures.com';

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
  profileImg?: string | null;
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

  updateUserProfile: async (
    accessToken: string,
    userData: {
      name: string;
      email: string;
      mobileNumber: string;
      profileImgFile?: File;
      removeProfileImg?: boolean;
    }
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('mobileNumber', userData.mobileNumber);
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('removeProfileImg', String(userData.removeProfileImg || false));
    if (userData.profileImgFile) {
      formData.append('profileImgFile', userData.profileImgFile);
    }

    const response = await fetch(`${BASE_URL}/user/edit`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update profile');
    }
  },

  deleteProfileImage: async (accessToken: string, mobileNumber: string): Promise<void> => {
    const formData = new FormData();
    formData.append('mobileNumber', mobileNumber);
    formData.append('removeProfileImg', 'true');

    const response = await fetch(`${BASE_URL}/user/edit`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile image');
    }
  },

  getAllUsers: async (accessToken: string): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/user/all`, {
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

  deleteUser: async (accessToken: string, userId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },

  updateUser: async (accessToken: string, userId: number, data: Partial<User>): Promise<User> => {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  },
};
