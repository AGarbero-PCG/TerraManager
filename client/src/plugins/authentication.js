// client/src/plugins/authentication.js
// This plugin will handle the actual API calls related to authentication (login, register, logout). It interacts with the MongoDB Data API for user authentication. The plugin will be used in the auth store to perform these actions.

import axios from 'axios';

const baseURL = process.env.VITE_MONGODB_API_ENDPOINT;
const apiKey = process.env.VITE_MONGODB_API_KEY;

const authentication = {
  install(app) {
    const apiClient = axios.create({
      baseURL: process.env.MONGODB_API_ENDPOINT, // Use your MongoDB Data API URL
      headers: {
        'Content-Type': 'application/json',
        'apiKey': process.env.MONGODB_API_KEY // Add your MongoDB API Key from the .env file
      }
    });

    // Login method
    app.config.globalProperties.$login = async (email, password) => {
      try {
        const response = await apiClient.post('/auth/providers/local-userpass/login', {
          email,
          password
        });
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    };

    // Register method
    app.config.globalProperties.$register = async (email, password) => {
      try {
        const response = await apiClient.post('/auth/providers/local-userpass/register', {
          email,
          password
        });
        return response.data;
      } catch (error) {
        console.error('Error registering:', error);
        throw error;
      }
    };

    // Logout method
    // Refresh method
  }
};

export default authentication;
