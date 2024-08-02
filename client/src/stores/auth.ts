// This file is for fetching and storing authenticated users
import { defineStore } from "pinia"

// This user model represents our state user
export interface User {
	id: number,
	username: string,
	email: string,
	first_name: string,
	last_name: string,
}

export interface State {
	user: User
}


export const useAuthStore = defineStore('auth', {
	// Used to store Data
	state: (): State => {
		return {
			// Using this interface as a model for user state
			user: {} as User
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
		async login() {

		},

		async register() {

		},

		async getUser() {

		},

		async logout() {

		},

		async refresh() {

		}
	}
})
