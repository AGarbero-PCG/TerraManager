// client/src/stores/landHolding.ts
import { defineStore } from 'pinia';
import { useApi } from "../composables/useApi";

// Define the type for a Land Holding
export interface LandHolding {
	id: number,
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
	id: number | null,
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
			// Using this interface as a model for landholding state
			landHoldings: [],
		};
	},

	// Used to format state data
	getters: {
		landholdingDetail: (state: State) => state.landHoldings, // For returning landholding data
	},

	// Used to modify data inside the state
	actions: {
		// Run refresh and get user data
		async attempt() {
			try {
				await this.getLandHoldings()
			} catch (error) {
				return
			}
			return
		},

		async createLandHolding(payload: LandHoldingData) {
			try {
				const { data } = await useApi().post('/api/landholdings/createLandHolding', payload);
				return data;
			} catch (error: Error | any) {
				console.error('Error during LandHolding creation:', error);
			}
		},
		async getLandHoldings() {
			try {
				const { data } = await useApi().get<LandHolding[]>(`/api/landholdings/getLandHoldings`);
				this.landHoldings = data;
				return data;
			} catch (error: Error | any) {
				console.error('Error fetching LandHoldings:', error);
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
		async deleteLandHolding(landHoldingId: number) {
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
