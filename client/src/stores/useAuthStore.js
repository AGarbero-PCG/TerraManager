// client/src/stores/useAuthStore.js
import { defineStore } from 'pinia';
import * as Realm from 'realm-web';

// Create a new Realm app instance
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });

export const useAuthStore = defineStore('auth', {

  state: () => ({
    user: null,
    accessToken: "",
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  actions: {
    // Get the Realm app instance
    getAppInstance() {
      if (!app) {
        throw new Error("Realm App is not initialized properly");
      }
      return app;
    },

    // Register a new user
    async register(registerData) {
      console.log("Inside registration function");
      this.loading = true;
      this.error = null;

      try {
        console.log("Registering user with:", registerData);
        
        await app.emailPasswordAuth.registerUser(registerData.email, registerData.password);
        
        console.log("User registered successfully");
        // Optionally log the user in right after registration
        await this.login({ email: registerData.email, password: registerData.password });
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
        console.log("Logging in with:", loginData);
        const credentials = Realm.Credentials.emailPassword(loginData.email, loginData.password);
        const user = await app.logIn(credentials);

        // Store the user in local storage
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.user = user;
        this.accessToken = user.accessToken;
        this.isAuthenticated = true;
        console.log("User logged in successfully:", user);
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
      this.error = null;

      try {
        if (app.currentUser) {
          await app.currentUser.logOut();
          localStorage.removeItem("currentUser");
          this.isAuthenticated = false;
          this.user = null;
          this.accessToken = "";
          console.log("User logged out successfully");
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error logging out: " + error.message);
      } finally {
        this.loading = false;
      }
    },

    // Refresh the token (if needed)
    async refresh() {
      try {
        const currentUser = app.currentUser;
        if (!currentUser) {
          console.error("No user logged in");
          return false;
        }
        // Check if the access token is expired and refresh it if necessary
        if (currentUser.isAccessTokenExpired) {
          console.log("Access token expired, refreshing...");
          await currentUser.refreshAccessToken();
          console.log("Access token refreshed successfully");
        } else {
          console.log("Access token is still valid.");
        }
        return true;
      } catch (error) {
        console.error("Error refreshing token:", error.message);
        return false;
      }
    },

    // Auto-login if a session exists in local storage
    async autoLogin() {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          app.currentUser = user;
          this.user = user;
          this.accessToken = user.accessToken;
          this.isAuthenticated = true;
          console.log("User session restored from local storage:", user);
        } catch (error) {
          console.error("Failed to restore user session:", error.message);
        }
      }
    }
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUserEmail: (state) => state.user?.profile?.email || null // MongoDB Realm user profile contains email
  }
});
