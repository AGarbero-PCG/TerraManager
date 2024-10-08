// client/src/stores/auth.js
// This store handles the state of authentication in the app. It interacts with the authentication.js plugin to perform actions like logging in, registering, and managing tokens. It also includes getters for computed state like whether the user is logged in and the user's email.

import { defineStore } from 'pinia';
import authentication from '../plugins/authentication';
import { useRouter } from 'vue-router'; // If you need to navigate after login/logout

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  actions: {
    // Register a new user
    async register(email, password) {
      console.log("Inside registration function");
        
      this.loading = true;
      this.error = null;
      try {
        console.log("Inside 'register' try block");
        
        const user = await authentication.register(email, password); // User object returned from Realm
        this.user = user;
        this.accessToken = user.access_token; // Get the access token from the user object
        this.isAuthenticated = true; // You can store more user info if available
        console.log("User registered successfully");
      } catch (error) {
        this.error = error.message;
        console.error("Error registering user: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    // Login an existing user
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const user = await authentication.login(email, password); // User object returned from Realm
        this.user = user;
        this.accessToken = user.access_token; // Use the access token from MongoDB API
        this.isAuthenticated = true;
        console.log("User logged in successfully: ", user);
      } catch (error) {
        this.error = error.message;
        console.error("Error logging in user: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    // Log out the user
    async logout() {
      this.loading = true;
      try {
        await authentication.logout();
        this.isAuthenticated = false;
        this.accessToken = null;
        this.user = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Refresh the token (if needed)
    async refresh() {
      this.loading = true;
      try {
        const newToken = await authentication.refreshToken();
        this.accessToken = newToken;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  },

  // Optionally use getters for some computed state
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUserEmail: (state) => state.user?.profile?.email || null // MongoDB Realm user profile contains email
  }
});