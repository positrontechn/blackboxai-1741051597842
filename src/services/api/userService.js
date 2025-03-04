import apiClient from './apiClient';

const USER_ENDPOINT = '/api/users';

export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`${USER_ENDPOINT}/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(`${USER_ENDPOINT}/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get user contribution history
  getContributionHistory: async (userId) => {
    try {
      const response = await apiClient.get(`${USER_ENDPOINT}/${userId}/contributions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contribution history:', error);
      throw error;
    }
  },

  // Get user badges
  getUserBadges: async (userId) => {
    try {
      const response = await apiClient.get(`${USER_ENDPOINT}/${userId}/badges`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (userId, settings) => {
    try {
      const response = await apiClient.put(`${USER_ENDPOINT}/${userId}/notifications`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Get notification settings
  getNotificationSettings: async (userId) => {
    try {
      const response = await apiClient.get(`${USER_ENDPOINT}/${userId}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // Get user volunteer history
  getVolunteerHistory: async (userId) => {
    try {
      const response = await apiClient.get(`${USER_ENDPOINT}/${userId}/volunteer-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteer history:', error);
      throw error;
    }
  },

  // Update user preferences
  updateUserPreferences: async (userId, preferences) => {
    try {
      const response = await apiClient.put(`${USER_ENDPOINT}/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
};

export default userService;
