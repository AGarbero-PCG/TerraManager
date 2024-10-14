// client/src/stores/auth.js
// This store handles the state of authentication in the app. It interacts with the authentication.js plugin to perform actions like logging in, registering, and managing tokens. It also includes getters for computed state like whether the user is logged in and the user's email.

import { defineStore } from 'pinia';
import authentication from '../plugins/authentication';
import { useRouter } from 'vue-router'; // If you need to navigate after login/logout


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: "",
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  actions: {
    getAppInstance() {
      let app = Realm.App.getApp(import.meta.env.VITE_REALM_APP_ID);
      if (!app) {
        app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
      }
      return app;
    },

    // Register a new user
    async register(registerData) {
      console.log("Inside registration function");
        
      this.loading = true;
      this.error = null;
      try {
        console.log("Inside 'register' try block");
        
        const user = await authentication.register( registerData ); // User object returned from Realm
        console.log(email, password);

        // Store the user object in local storage
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        this.user = user;
        console.log("User object: ", user);
        
        //this.accessToken = user.access_token; // Get the access token from the user object
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
    async login(loginData) {
      this.loading = true;
      this.error = null;
      try {
        const user = await authentication.login( loginData ); // User object returned from Realm
        // Store the user object in local storage
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.user = user;
        this.accessToken = user._accessToken; // Use the access token from MongoDB Realm
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
        this.accessToken = null;
        // Remove the user object from local storage
        localStorage.removeItem("currentUser", JSON.stringify(user));
        this.isAuthenticated = false;
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
