// This file is for fetching and storing authenticated users
import { defineStore } from "pinia"
import useApi from "../composables/useApi"

// This user model represents our state user
export interface User {
	id: number,
	username: string,
	email: string,
	first_name: string,
	last_name: string,
	full_name?: string
}

export interface State {
	user: User,
	accessToken: string
}

export interface LoginData {
	email: string,
	password: string
}

export interface RegisterData {
	username: string,
	email: string,
	first_name: string,
	last_name: string,
	password: string,
	password_confirm: string
}


export const useAuthStore = defineStore('auth', {
	// Used to store Data
	state: (): State => {
		return {
			// Using this interface as a model for user state
			user: {} as User,
			accessToken: "" as string
		}
	},

	// Used to format state data
	getters: {
		userDetail: (state: State) => state.user, // For returning user data
		isAuthenticated: (state: State) => state.accessToken ? true : false // Return a boolean indicating whether user is authenticated or not
	},

	// Used to modify data inside the state
	actions: {

		async attempt() {
			try {
				await this.refresh()
				await this.getUser()
			} catch (error) {
				return
			}
			return
		},

		// Asynchronous because we will use backend API requests
		async login(payload: LoginData) {
			try {
				const { data } = await useApi().post(`/api/auth/login`, payload);
				this.accessToken = data.access_token // Assign received access token to state
				await this.getUser()
				return data
			} catch (error: Error | any) {
				throw error.response.message
			}
		},

		async register(payload: RegisterData) {
			try {
				const { data } = await useApi().post(`/api/auth/register`, payload);
				return data
			} catch (error: Error | any) {
				// throw error.response.message

				// Log detailed error information to the console
				console.error('Error during registration:', error);

				// Check if the error response exists and has a message
				if (error.response) {
					console.error('Error response data:', error.response.data);
					console.error('Error response status:', error.response.status);
					console.error('Error response headers:', error.response.headers);

					// Throw the specific error message from the response
					throw new Error(error.response.data.message || 'Unknown error occurred');
				} else {
					// If no response is present, throw a generic error
					throw new Error(error.message || 'Unknown error occurred');
				}
			}
		},

		async getUser() {
			try {
				const { data } = await useApi().get(`/api/auth/user`);
				console.log('User data from API:', data);
				this.user = data.user;
				return data
			} catch (error: Error | any) {
				console.error('Error fetching user data', error);
			}
		},

		async logout() {
			try {
				const { data } = await useApi().post(`/api/auth/logout`);
				this.accessToken = ""
				this.user = {} as User
				return data
			} catch (error: Error | any) {
				throw error.response.message
			}
		},

		async refresh() {
			try {
				const { data } = await useApi().post(`/api/auth/refresh`);
				this.accessToken = data.access_token
				return data
			} catch (error: Error | any) {
				throw error.response.message
			}
		}
	}
})
