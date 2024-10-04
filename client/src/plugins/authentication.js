// client/src/plugins/authentication.js
// This plugin will handle the actual API calls related to authentication (login, register, logout). It interacts with the MongoDB Data API for user authentication. The plugin will be used in the auth store to perform these actions.

import axios from 'axios';

const baseURL = process.env.MONGODB_API_ENDPOINT || 'https://us-west-2.aws.data.mongodb-api.com/app/<APP_ID>/endpoint/data/v1';
const apiKey = process.env.MONGODB_API_KEY; // Ensure API key is in .env file

export default {
  // Register a new user
  async register(email, password) {
    try {
      const response = await axios.post(`${baseURL}/auth/providers/local-userpass/register`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'apiKey': apiKey
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error registering user: ' + error.response?.data?.message || error.message);
    }
  },

  // Login a user
  async login(email, password) {
    try {
      const response = await axios.post(`${baseURL}/auth/providers/local-userpass/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'apiKey': apiKey
        }
      });
      return response.data; // Returns access token and user info
    } catch (error) {
      throw new Error('Error logging in: ' + error.response?.data?.message || error.message);
    }
  },

  // Log out a user (could also just clear the local token)
  async logout() {
    // No specific MongoDB API logout endpoint, just clear local tokens or sessions
    try {
      // Perform any necessary cleanup, such as removing tokens from local storage or cookies
      return true;
    } catch (error) {
      throw new Error('Error logging out: ' + error.message);
    }
  },

  // Optionally refresh tokens (if you're using refresh tokens)
  async refreshToken() {
    try {
      // Placeholder for handling refresh logic, if needed
    } catch (error) {
      throw new Error('Error refreshing token: ' + error.message);
    }
  }
};
