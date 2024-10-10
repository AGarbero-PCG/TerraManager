// client/src/composables/useApi.js

import axios from 'axios';
import * as Realm from 'realm-web';
import { useAuthStore } from "../stores/useAuthStore";
import { watchEffect } from 'vue';

// Create a new Realm app instance
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });

// Authentication methods using Realm Web SDK
export const useApi = () => {

    // Register a new user
    const register = async (email, password) => {
        try {
            const credentials = Realm.Credentials.emailPassword(email, password);
            await app.emailPasswordAuth.registerUser({email, password}); // Register the user in MongoDB Realm
            console.log("User registered successfully");
        } catch (error){
            console.error("Error registering user: " + error.message);
            throw error;
        }
    };

    // Login a user
    const login = async (email, password) => {
        try {
            const credentials = Realm.Credentials.emailPassword(email, password);
            const user = await app.logIn(credentials); // Log the user in
            localStorage.setItem('accessToken', user.accessToken); // Store the access token in local storage
            console.log("User logged in successfully");
            return user;
        } catch (error){
            console.error("Error logging in: " + error.message);
            throw error;
        }
    };

    // Logout the current user
    const logout = async () => {
        try {
            await app.currentUser?.logOut(); // Log out the user
            localStorage.removeItem('accessToken'); // Remove the access token from local storage
            console.log("User logged out successfully");
        } catch (error){
            console.error("Error logging out: " + error.message);
            throw error;
        }
    };

    return {
        register,
        login,
        logout,
        axiosInstance, // Public API
        axiosPrivateInstance // Private API
    }
}