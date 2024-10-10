// client/src/stores/useAuthStore.js
// This store handles the state of authentication in the app. It interacts with the authentication.js plugin to perform actions like logging in, registering, and managing tokens. It also includes getters for computed state like whether the user is logged in and the user's email.

import { defineStore } from 'pinia';
import * as Realm from "realm-web";

// Create a new Realm app instance

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
console.log("Realm App ID:", import.meta.env.VITE_REALM_APP_ID);

// Degine the auth store using Pinia
export const useAuthStore = defineStore('authStore', {
  // State properties of the store
  state: () => ({
    // Current user object
    currentUser: null,
    // Fields for user registration
    registrationFields: {
      first_name: "",
      last_name: "",
      name: "", // Full name
      email: "",
      password: "",
      confirm_password: ""
    },

    loginFields: {
      first_name: "",
      last_name: "",
      name: "", // Full name
      email: "",
      password: "",
      confirm_password: ""
    },
    accessToken: null,
    isAuthenticated: false,
  }),

  actions: {
    // Register a new user
    async register() {
      console.log("Inside registration function");
      try {
        console.log("Inside 'register' try block");

        // Combine first name and last name into a single name field
        this.registerData.name = this.registerData.first_name + " " + this.registerData.last_name;

        // Register the user in MongoDB Realm
        await app.emailPasswordAuth.registerUser({
          email: this.registerData.email,
          password: this.registerData.password,
        });
        
        console.log("User registered successfully");
        
        // Log in the user after registration
        const credentials = Realm.Credentials.emailPassword( this.registerData.email, this.registerData.password );
        const user = await app.logIn(credentials); // Login the user using credentials

        this.currentUser = user; // Save the logged-in user in the state
        this.accessToken = user.access_token; // Set the access token
        this.isAuthenticated = true; // Set the authenticated flag

        console.log("User logged in successfully: ", user);

      } catch (error) {
        this.error = error.message;
        console.error("Error registering user: " + error.message);
      }
    },

    // Login an existing user
    async login( loginData ) {
      try {
        const credentials = Realm.Credentials.emailPassword( loginData.email, loginData.password );
        const user = await app.logIn(credentials); // Login the user using credentials
        this.currentUser = user;
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
      try {
        const user = app.currentUser;
        if (user) {
          await user.logOut(); // Log out the current user
        }
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
      try {
        const newToken = await authentication.refreshToken();
        this.accessToken = newToken;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Get the user
    async getUser() {
      try {
        const user = await authentication.getUser();
        this.user = user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false
      }
    }
  },
});
