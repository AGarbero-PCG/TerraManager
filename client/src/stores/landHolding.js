// client/src/stores/landHolding.ts
import { defineStore } from 'pinia';
import * as Realm from 'realm-web';

// Initialize a new Realm app instance
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });

// Define the LandHolding store
export const useLandHoldingStore = defineStore('landholding', {
	// Used to store Data
	state: () => ({
			landHoldings: [], // Array to store land holding data
	}),

	// Used to format state data
	getters: {
		landholdingDetail: (state) => state.landHoldings, // For returning land holding data
	},

	// Used to modify data inside the state
	actions: {
		// Run refresh and get land holding data
		async attempt(ownerId) {
			try {
				await this.getLandHoldings(ownerId)
			} catch (error) {
				console.error("Error getting land holdings: " + error.message);
			}
		},

        // Create a new land holding
		async createLandHolding(payload) {
			this.loading = true;
            try {
				const mongo = app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongo.db('phx_db').collection('landholdings');
                const result = await collection.insertOne(payload); // Insert a document
                this.landHoldings.push(result);
                return result;
			} catch (error) {
				this.error = error.message;
			} finally {
                this.loading = false;
            }
		},

        // Get all land holdings for a specific owner
		async getLandHoldings(ownerId) {
			this.loading = true;
            try {
				const mongo = app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongo.db('phx_db').collection('landholdings');
                const result = await collection.find({ ownerId: ownerId }); // Find all documents
                this.landHoldings = result;
			} catch (error) {
				this.error = error.message;
			} finally {
                this.loading = false;
            }
		},

        // Get a specific land holding by ID
		async getLandHoldingById(landHoldingId) {
			this.loading = true;
            try {
				const mongo = app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongo.db('phx_db').collection('landholdings');
                const result = await collection.findOne({ _id: landHoldingId }); // Find a single document
                return result;
			} catch (error) {
				this.error = error.message;
			} finally {
                this.loading = false;
            }
		},

        // Update a specific land holding
		async updateLandHolding(payload) {
            this.loading = true;
			try {
				const mongo = app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongo.db('phx_db').collection('landholdings');
                const result = await collection.updateOne(
                    { _id: payload.id }, // Find the document by ID
                    { $set: payload } // Update the document
                );
                return result;
			} catch (error) {
				this.error = error.message;
			} finally {
                this.loading = false;
            }
		},
		async deleteLandHolding(landHoldingId) {
            this.loading = true;
			try {
				const mongo = app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongo.db('phx_db').collection('landholdings');
                const result = await collection.deleteOne({ _id: landHoldingId }); // Delete the document
                this.landHoldings = this.landHoldings.filter((landHolding) => landHolding._id !== landHoldingId);
                return result;
			} catch (error) {
				this.error = error.message;
			} finally {
                this.loading = false;
            }
		},
	}
});
