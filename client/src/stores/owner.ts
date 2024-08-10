import { defineStore } from 'pinia';
import { useApi } from "../composables/useApi"

// Define the type for an Owner
export interface Owner {
	id: number,
	name: string,
	entity_type: 'Company' | 'Individual' | 'Investor' | 'Trust',
	owner_type: 'Competitor' | 'Seller' | 'Investor' | 'Professional',
	address: string,
	total_land_holdings: number
}

export interface State {
	owner: Owner
}

export interface OwnerData {
	name: string,
	entity_type: 'Company' | 'Individual' | 'Investor' | 'Trust',
	owner_type: 'Competitor' | 'Seller' | 'Investor' | 'Professional',
	address: string,
	total_land_holdings: number
}


export const useOwnerStore = defineStore('owner', {
	// Used to store Data
	state: (): State => {
		return {
			// Using this interface as a model for owner state
			owner: {} as Owner,
		}
	},

	// Used to format state data
	getters: {
		ownerDetail: (state: State) => state.owner, // For returning owner data
	},

	// Used to modify data inside the state
	actions: {
		// Run refresh and get user data
		async attempt() {
			try {
				await this.getOwners()
			} catch (error) {
				return
			}
			return
		},

		async createOwner(payload: OwnerData) {
			try {
				const { data } = await useApi().post('/api/owners/createOwner', payload);
				return data
			} catch (error: Error | any) {
				console.error('Error during Owner creation:', error);
			}

		},
		async getOwners() {
			// try {
			// 	const { data } = await useApiPrivate().get(`/api/auth/user`); // We use useApiPrivate bc it has to have an auth token and a refresh token on the cookie
			// 	console.log('User data from API:', data);
			// 	this.user = data.user;
			// 	return data
			// } catch (error: Error | any) {
			// 	console.error('Error fetching user data', error);
			// }
		},
	}
});
