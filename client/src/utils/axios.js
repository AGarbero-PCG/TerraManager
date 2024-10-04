// Basic configuration for axios package in order to create composables
import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:3500', // API endpoint for the backend: import.meta.env.VITE_API_URI
	withCredentials: true, // Used to send HTTP-only cookies to the backend
	headers: {
		'Content-Type': 'application/json' // Necessary to be able to work with JSON data
	}
});

export const axiosPrivateInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URI || 'http://localhost:3500', // Fallback to local API endpoint if environment variable is not set
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})
