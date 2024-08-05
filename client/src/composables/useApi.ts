// Used for request and response handling
import { axiosInstance } from "../utils/axios";
import { useAuthStore } from "../stores/auth"
import { watchEffect } from "vue";
import type { AxiosInstance } from "axios";

export default function useApi() {

	const authStore = useAuthStore()

	watchEffect(() => { // Use watchEffect to reactively trigger functionality based on dependencies
		// Request interceptor
		axiosInstance.interceptors.request.use(
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
		axiosInstance.interceptors.response.use(
			response => response,
			async (error) => {
				const prevRequest = error?.config; // Access error request configuration

				// Check response status against 401 and 403
				if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest.sent) {
					prevRequest.sent = true;
					await authStore.refresh()
					prevRequest.headers["Authorization"] = authStore.accessToken
					return axiosInstance(prevRequest)
				}

				return Promise.reject(error)
			}
		)
	})


	return axiosInstance
}
