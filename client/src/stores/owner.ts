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
	owners: Owner[];
}

export interface OwnerData {
	id?: number | null, // Make id optional because it won't be present when creating a new owner
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
			owners: [],
		};
	},

	// Used to format state data
	getters: {
		ownerDetail: (state: State) => state.owners, // For returning owner data
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
			try {
				const { data } = await useApi().get<Owner[]>(`/api/owners/getOwners`);
				this.owners = data;
				return data
			} catch (error: Error | any) {
				console.error('Error fetching Owners:', error);
			}
		},
		async updateOwner(payload: OwnerData) {
			try {
				const { data } = await useApi().put(`/api/owners/updateOwner/${payload.id}`, payload);
				return data
			} catch (error: Error | any) {
				console.error('Error during Owner update:', error);
			}
		},
		async deleteOwner() {
			try {
				const { data } = await useApi().delete<Owner[]>(`/api/owners/deleteOwner`);
				this.owners = data;
				return data
			} catch (error: Error | any) {
				console.error('Error deleting Owner:', error);
			}
		},
	}
});
