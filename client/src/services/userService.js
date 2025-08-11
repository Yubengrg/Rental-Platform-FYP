// ============ CLIENT/SRC/SERVICES/USERSERVICE.JS ============
import api from './api';

const userService = {
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (pictureData) => {
    const response = await api.put('/users/profile-picture', pictureData);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await api.put('/users/deactivate');
    return response.data;
  }
};

export default userService;