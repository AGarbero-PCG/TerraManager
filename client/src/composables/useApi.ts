// Used for request and response handling
import { axiosInstance, axiosPrivateInstance } from "../utils/axios";
import { useAuthStore } from "../stores/auth"
import { watchEffect } from "vue";
import type { AxiosInstance } from "axios";
import axios from "axios";

export function useApiPrivate(): AxiosInstance {

	const authStore = useAuthStore()

	watchEffect(() => { // Use watchEffect to reactively trigger functionality based on dependencies
		// Request interceptor
		axiosPrivateInstance.interceptors.request.use(
			(config) => {
				// If we DONT have authorization header set...
				if (!config.headers["Authorization"]) {
					// Set authorization header to access token
					config.headers["Authorization"] = `Bearer ${authStore.accessToken}`
				}
				return config
			},
			(error) => Promise.reject(error)
		)

		// Response interceptor
		axiosPrivateInstance.interceptors.response.use(
			response => response,
			async (error) => {
				const prevRequest = error?.config; // Access error request configuration

				// Check response status against 401 and 403
				if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest.sent) {
					prevRequest.sent = true;
					try {
						await authStore.refresh()
						prevRequest.headers["Authorization"] = authStore.accessToken
						return axiosPrivateInstance(prevRequest)
					} catch (error) {
						return Promise.reject(error)
					}
				}

				return Promise.reject(error)
			}
		)
	})


	return axiosPrivateInstance;
}


export function useApi() {
	return axiosInstance;
}


export const getOwners = async () => {
	try {
		const response = await axios.get('/api/owners/getOwners');
		return response.data;
	} catch (error) {
		console.error("Error fetching owners:", error);
		throw error;
	}
}
