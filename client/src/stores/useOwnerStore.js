// /client/src/stores/useOwnerStore.js
import { defineStore } from 'pinia';
import * as Realm from "realm-web";
import { useAuthStore } from './auth';


const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });

// const currentUser = app.currentUser;
// if (currentUser && currentUser.mongoClient) {
//   var mongodb = app.currentUser.mongoClient("mongodb-atlas");
//   var ownersCollection = mongodb.db("phx_db").collection("owners");
// } else {
//   console.error("MongoDB client is not available");
// }
// Access the owners collection in the MongoDB database


// Define the Pinia store for managing owner data in OwnerManager.vue
// Create a store named 'owner' using defineStore, and export is for use throughout the application
export const useOwnerStore = defineStore('owner', {
  // The state function returns an object that contains the reactive state of the store
  state: () => ({
    owners: [] // Initialize the owners array to store owner data
  }),

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
        // Get the current user and MongoDB client
        const currentUser = app.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const mongodb = currentUser.mongoClient("mongodb-atlas");
        const ownersCollection = mongodb.db("phx_db").collection("owners");

        console.log("Payload before destructuring: ", payload);

        // Create an owner data object excluding the _id field
        const { _id, ...ownerData } = payload;

        // Log the sanitized owner data
        console.log("Owner store create payload: ", ownerData);

        // Insert the new owner data into the ownersCollection
        const result = await ownersCollection.insertOne(ownerData);
        console.log("MongoDB insertOne response: ", result);

        // Check if insertedId is present and assign it to the payload
        const createdOwner = { ...ownerData, _id: result.insertedId };

        // Push the newly created owner to the 'owners' array
        this.owners.push(createdOwner);
        
        console.log("Owner created successfully: ", createdOwner);
        return createdOwner;
      } catch (error) {
        console.error('Error during Owner creation:', error);
      }
    },
    
    async getOwners() {
      try {
        // Get the current user and MongoDB client
        const currentUser = app.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const mongodb = currentUser.mongoClient("mongodb-atlas");
        const ownersCollection = mongodb.db("phx_db").collection("owners");
        
        console.log("ownersCollection: ", ownersCollection);
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
        // Get the current user and MongoDB client
        const currentUser = app.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const mongodb = currentUser.mongoClient("mongodb-atlas");
        const ownersCollection = mongodb.db("phx_db").collection("owners");

        // Ensure the payload includes an _id for finding the correct document to update
        if (!payload._id) {
          throw new Error("Owner ID is required for update");
        }

        // Create an update data object excluding the _id field
        const { _id, ...updateData } = payload;

        // Log the sanitized updated owner data
        console.log("Owner store update payload: ", updateData);

        // Attempt to update the owner in the ownersCollection
        const result = await ownersCollection.updateOne(
          { _id: new Realm.BSON.ObjectID(_id) }, // Use the unique _id to filter the owner
          { $set: updateData } // Use $set to update only the specified fields
        );

        console.log("MongoDB updateOne response: ", result);

        // Check if the document was modified
        if (result.modifiedCount > 0) {
          // Find the index of the updated owner in the local state array
          const index = this.owners.findIndex(owner => owner._id.toString() === _id);
          if (index !== -1) {
            // Update the local state with the updated owner data
            this.owners[index] = { ...this.owners[index], ...updateData };
          }
          console.log("Owner updated successfully: ", this.owners[index]);
          return this.owners[index];
        } else {
          console.log("Owner not found or no changes made");
          return null;
        }
      } catch (error) {
        console.error('Error during Owner update: ', error);
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


