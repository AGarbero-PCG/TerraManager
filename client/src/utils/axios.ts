// Basic configuration for axios package in order to create composables
import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URI, // API endpoint for the backend
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
