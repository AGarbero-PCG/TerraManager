// Basic configuration for axios package in order to create composables
import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'https://terra-manager.onrender.com', // API endpoint for the backend: import.meta.env.VITE_API_URI
	withCredentials: true, // Used to send HTTP-only cookies to the backend
	headers: {
		'Content-Type': 'application/json' // Necessary to be able to work with JSON data
	}
});

export const axiosPrivateInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URI,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})
