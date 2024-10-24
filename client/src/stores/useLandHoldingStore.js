// client/src/stores/useLandholdingStore.js
import { defineStore } from 'pinia';
import * as Realm from 'realm-web';

// Initialize a new Realm app instance
const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });


// Define the LandHolding store
export const useLandHoldingStore = defineStore('landholding', {
	// The state function returns an object that contains the reactive state of the store
	state: () => ({
			landholdings: [], // Initialize the landholdings array to store land holding data
	}),

	// Used to format state data
	getters: {
		landholdingDetail: (state) => state.landholdings, // For returning land holding data
	},

	// Used to modify data inside the state
	actions: {
		// Run refresh and get land holding data
		async attempt(ownerId) {
			try {
				await this.getLandHoldings(ownerId)
			} catch (error) {
				console.error("Error getting land holdings: " + error.message);
				throw new Error("Error getting land holdings: " + error.message);
			}
		},

        // Create a new land holding
		async createLandHolding(payload, ownerId) {
            try {
				// Get the current user and MongoDB client
				const currentUser = app.currentUser;
				if (!currentUser) {
				  throw new Error("User not authenticated");
				}
				const mongodb = currentUser.mongoClient("mongodb-atlas");
                const landHoldingsCollection = mongodb.db('phx_db').collection('landholdings');

				console.log("payload.owner: ", payload.owner);
				// Insert the new land holding data into the landHoldingsCollection
                const result = await landHoldingsCollection.insertOne(payload);
				console.log("MongoDB insertOne response: ", result.insertedId.toString());

				// Check if insertedId is present and assign it to the payload
				const createdLandHolding = { ...payload, _id: result.insertedId };

                this.landholdings.push(createdLandHolding);

				console.log("this.landholdings: ", this.landholdings);

                console.log("Land holding created successfully: ", createdLandHolding);
				return createdLandHolding;
			} catch (error) {
				this.error = error.message;
				throw new Error("Error creating land holding: " + error.message);
			}
		},

        // Get all land holdings for a specific owner
		async getLandHoldings(ownerId) {
            try {
				// Get the current user and MongoDB client
				const currentUser = app.currentUser;
				if (!currentUser) {
				  throw new Error("User not authenticated");
				}
				const mongodb = currentUser.mongoClient("mongodb-atlas");
                const landHoldingsCollection = mongodb.db('phx_db').collection('landholdings');

				console.log("landHoldingsCollection: ", landHoldingsCollection);
				// Fetch all land holdings for the owner
                const data = await landHoldingsCollection.find({ owner: new Realm.BSON.ObjectID(ownerId) });

				// Assign the fetched data to the component state
                this.landholdings = data;
				return data;
			} catch (error) {
				console.error("Error getting land holdings: " + error.message);
				throw new Error("Error getting land holdings: " + error.message);
			}
		},

        // Update a specific land holding
		async updateLandHolding(payload) {

			console.log("payload: ", payload);

			try {
				// Get the current user and MongoDB client
				const currentUser = app.currentUser;
				if (!currentUser) {
				  throw new Error("User not authenticated");
				}
				const mongodb = currentUser.mongoClient("mongodb-atlas");
                const landHoldingsCollection = mongodb.db('phx_db').collection('landholdings');
				
				if (!payload._id) {
					throw new Error("Land holding ID is required for update");
				}

				// Log the inserted land holding data
				console.log("Land holding store update payload: ", payload);

				// Attempt to update the land holding in the landHoldingsCollection
                const result = await landHoldingsCollection.updateOne(
                    { _id: new Realm.BSON.ObjectID(payload._id) }, // Use the unique _id to filter the land holding
                    { $set: payload } // Use $set to update only the specified fields
                );

                console.log("MongoDB updateOne response: ", result);

				// Check if the document was modified
				if (result.modifiedCount > 0) {
					// Find the index of the updated land holding in the local state array
					const index = this.landholdings.findIndex(landholding => landholding?._id?.toString() === payload._id.toString());
					if (index !== -1) {
					  // Update the local state with the updated owner data
					  this.landholdings[index] = { ...this.landholdings[index], ...payload };
					}
					console.log("Land holding updated successfully: ", this.landholdings[index]);
					return this.landholdings[index];
				} else {
					console.log("Land holding not found. No changes made.")
					throw new Error("Landholding not found. No changes made.");
				}
			} catch (error) {
				console.error("Error updating land holding: " + error.message);
				throw new Error("Error updating land holding: " + error.message);
			}
		},

		async deleteLandHolding(payload) {
            try {
				// Get the current user and MongoDB client
				const currentUser = app.currentUser;
				if (!currentUser) {
				  throw new Error("User not authenticated");
				}
				const mongodb = currentUser.mongoClient("mongodb-atlas");
                const landHoldingsCollection = mongodb.db('phx_db').collection('landholdings');
		
				// Attempt to delete the owner from the ownersCollection using the unique _id
				const result = await landHoldingsCollection.deleteOne({ _id: new Realm.BSON.ObjectID(payload._id) });
			
				// If the document was deleted
				if (result.deletedCount > 0) {
				  // Update the local state to remove the deleted land holding
				  this.landholdings = this.landholdings.filter(
					landholding => landholding?._id?.toString() !== payload._id.toString()
				  );
				  console.log("Land Holding deleted successfully");
				} else {
				  console.log("Land Holding not found");
				}
			} catch (error) {
				// Log any errors that occur during the deletion process
				console.error('Error deleting Land Holdinf:', error);
			}
		},
	}
});
