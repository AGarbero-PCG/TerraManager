// client/src/stores/landHolding.ts
import { defineStore } from 'pinia';
// import { useApi } from "../composables/useApi.js";

// Define the type for a land holding
export interface LandHolding {
	id: string,
	owner: string, // Assuming the owner is referenced by an ID or name
	name: string,
	legal_entity: string,
	net_mineral_acres: number,
	mineral_owner_royalty: number,
	section: string,
	township: string,
	range: string,
	title_source: string,
}

export interface State {
	landHoldings: LandHolding[];
}

export interface LandHoldingData {
	id: string | null,
	owner: string, // Assuming the owner is referenced by an ID or name
	name: string,
	legal_entity: string,
	net_mineral_acres: number,
	mineral_owner_royalty: number,
	section: string,
	township: string,
	range: string,
	title_source: string,
}

export const useLandHoldingStore = defineStore('landholding', {
	// Used to store Data
	state: (): State => {
		return {
			// Using this interface as a model for land holding state
			landHoldings: [],
		};
	},

	// Used to format state data
	getters: {
		landholdingDetail: (state: State) => state.landHoldings, // For returning land holding data
	},

	// Used to modify data inside the state
	actions: {
		// Run refresh and get land holding data
		async attempt(ownerId: string) {
			try {
				await this.getLandHoldings(ownerId)
			} catch (error) {
				return
			}
			return
		},

		async createLandHolding(payload: LandHoldingData, ownerId: string) {
			try {
				const { data } = await useApi().post(`/api/landholdings/createLandHolding/${ownerId}`, payload);
				return data;
			} catch (error: Error | any) {
				console.error('Error during LandHolding creation:', error);
			}
		},
		async getLandHoldings(ownerId: string) {
			try {
				console.log('Fetching LandHoldings for ownerId:', ownerId);
				const { data } = await useApi().get<LandHolding[]>(`/api/landholdings/getLandHoldings/${ownerId}`);
				this.landHoldings = data;
				return data;
			} catch (error: Error | any) {
				console.error('Error fetching LandHoldings:', error);
			}
		},
		async getLandHoldingById(landHoldingId: string) {
			try {
				const { data } = await useApi().get<LandHolding[]>(`/api/landholdings/getLandHoldingById/${landHoldingId}`);
				this.landHoldings = data;
				return data;
			} catch (error: Error | any) {
				console.error('Error fetching Land Holding by ID:', error);
			}
		},
		async updateLandHolding(payload: LandHoldingData) {
			try {
				const { data } = await useApi().put(`/api/landholdings/updateLandHolding/${payload.id}`, payload);
				return data;
			} catch (error: Error | any) {
				console.error('Error during LandHolding update:', error);
			}
		},
		async deleteLandHolding(landHoldingId: string) {
			try {
				const { data } = await useApi().delete(`/api/landholdings/deleteLandHolding/${landHoldingId}`);
				this.landHoldings = this.landHoldings.filter(landHolding => landHolding.id !== landHoldingId);
				return data;
			} catch (error: Error | any) {
				console.error('Error deleting LandHolding:', error);
			}
		},
	}
});
