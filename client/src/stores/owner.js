import { defineStore } from 'pinia';
import * as Realm from "realm-web";

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
const currentUser = app.currentUser;
if (currentUser && currentUser.mongoClient) {
  var mongodb = app.currentUser.mongoClient("mongodb-atlas");
  var ownersCollection = mongodb.db("phx_db").collection("owners");
} else {
  console.error("MongoDB client is not available");
}
// Access the owners collection in the MongoDB database


// Define the store for owner data
export const useOwnerStore = defineStore('owner', {
  // Used to store data
  state: () => ({
    owners: []
  }),

  // Used to format state data
  getters: {
    ownerDetail: (state) => state.owners // For returning owner data
  },

  // Used to modify data inside the state
  actions: {
    // Run refresh and get user data
    async attempt() {
      try {
        await this.getOwners();
      } catch (error) {
        console.error('Error during refresh:', error);
      }
    },

    async createOwner(payload) {
      try {
        // Fetch the data from the owners collection
        console.log("Owner store create payload: ", payload);
        const data = await ownersCollection.insertOne(payload);
        console.log("MongoDB insertOne response: ", data);

        // Check if insertedId is present and assign it to the payload
        const createOwner = { ... payload, _id: data.insertedId };

        // Push to the local owners array with the correct id
        this.owners.push(createOwner);
        
        return createOwner;
      } catch (error) {
        console.error('Error during Owner creation:', error);
      }
    },

    async getOwners() {
      try {
        // Fetch the data from the owners collection
        const data = await ownersCollection.find();
        
        // Assign the fetched data to the component state
        this.owners = data;
        return data;
      } catch (error) {
        console.error('Error fetching Owners:', error);
      }
    },

    async updateOwner(payload) {
      try {
        console.log("Owner store update payload:", payload);
        const result = await ownersCollection.updateOne(
          // { _id: new Realm.BSON.ObjectID(payload._id) }, // Use the unique _id to filter the owner
          // { $set: { ...payload } } // Updat the owner data
          {_id: payload._id},
          {$set: { ...payload }}
        );

        // If the document was modified
        if (result.modifiedCount > 0) {
          const index = this.owners.findIndex(owner => owner._id.toString() === payload.id);
          if (index !== -1) {
            // Update the local state with the updated owner data
            this.owners[index] = { ...this.owners[index], ...payload };
          }
          console.log("Owner updated successfully");
          return this.owners[index];
        } else {
          console.log("Owner not found");
        }
      } catch (error) {
        console.error('Error during Owner update:', error);
      }
    },

    async deleteOwner(ownerId) {
      try {
        // Attempt to delete the owner from the ownersCollection using the unique _id
        const result = await ownersCollection.deleteOne({ _id: new Realm.BSON.ObjectID(ownerId) });
    
        // If the document was deleted
        if (result.deletedCount > 0) {
          // Update the local state to remove the deleted owner
          this.owners = this.owners.filter(owner => owner._id.toString() !== ownerId);
          console.log("Owner deleted successfully");
        } else {
          console.log("Owner not found");
        }
      } catch (error) {
        // Log any errors that occur during the deletion process
        console.error('Error deleting Owner:', error);
      }
    }
  }
});
