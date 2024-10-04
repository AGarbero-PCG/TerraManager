// client/src/composables/useApi.js

import axios from 'axios';
import { useAuthStore } from "../stores/auth";
import { watchEffect } from 'vue';

// Create a public axios instance (for non-protected routes)
const axiosInstance = axios.create({
  baseURL: process.env.MONGODB_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'apiKey': process.env.MONGODB_API_KEY
  }
});

// Create a private axios instance (for protected routes)
const axiosPrivateInstance = axios.create({
  baseURL: process.env.VITE_MONGODB_API_URI || 'https://your-mongodb-api-url',
  headers: {
    'Content-Type': 'application/json',
    'apiKey': process.env.VITE_MONGODB_API_KEY,
    'withCredentials': true // Used for requests that require credentials, like cookies or JWT tokens
  }
});

// Function for public API calls
export function useApi() {
  return axiosInstance;
}

// Function for private API calls
export function useApiPrivate() {
  const authStore = useAuthStore();

  // Use watchEffect to reactively trigger functionality based on dependencies like the authStore's access token
  watchEffect(() => {
    // Request interceptor for adding Authorization headers to private requests
    axiosPrivateInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${authStore.accessToken}`; // Attach the access token
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling token refresh on 401/403 responses
    axiosPrivateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config; // Get the previous request config

        // If the token has expired (403 or 401) and the request has not been retried yet
        if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest.sent) {
          prevRequest.sent = true; // Mark the request as sent
          try {
            await authStore.refresh(); // Call a method in the auth store to refresh the token
            prevRequest.headers["Authorization"] = `Bearer ${authStore.accessToken}`; // Attach the new access token
            return axiosPrivateInstance(prevRequest); // Retry the original request
          } catch (refreshError) {
            return Promise.reject(refreshError); // If refresh fails, reject the error
          }
        }

        return Promise.reject(error); // Reject the error if it's not recoverable
      }
    );
  });

  return axiosPrivateInstance; // Return the private instance to use in components or stores
}
