// This file is for fetching and storing authenticated users
import { defineStore } from "pinia"
import useApi from "../composables/useApi.js"

// This user model represents our state user
export interface User {
	id: number,
	username: string,
	email: string,
	first_name: string,
	last_name: string
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
		user: (state: State) => state.user, // For returning user data
		isAuthenticated: (state: State) => state.user?.id ? true : false // Return a boolean indicating whether user is authenticated or not
	},

	// Used to modify data inside the state
	actions: {
		// Asynchronous because we will use backend API requests
		async login(payload: LoginData) {
			try {
				const { data } = await useApi().post(`/api/auth/login`, payload);
				this.accessToken = data?.access_token // Assign received access token to state
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
				throw error.response.message
			}
		},

		async getUser() {
			try {
				const { data } = await useApi().get(`/api/auth/user`);
				this.user = data
				return data
			} catch (error: Error | any) {
				throw error.response.message
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
				this.accessToken = data?.access_token
				return data
			} catch (error: Error | any) {
				throw error.response.message
			}
		}
	}
})
