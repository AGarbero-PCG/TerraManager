import { defineStore } from 'pinia';
import * as Realm from "realm-web";

const app = new Realm.App({ id: import.meta.env.VITE_REALM_APP_ID });
const mongodb = app.currentUser.mongoClient("mongodb-atlas");
// Access the owners collection in the MongoDB database
const ownersCollection = mongodb.db("phx_db").collection("owners");

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
        const data = await ownersCollection.insertOne(payload);
        
        // Assign the fetched data to the component state
        this.owners = data;
        return data;
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
        const { data } = await useApi().put(`/api/owners/updateOwner/${payload.id}`, payload);
        const index = this.owners.findIndex(owner => owner.id === payload.id);
        if (index !== -1) {
          this.owners[index] = data;
        }
        return data;
      } catch (error) {
        console.error('Error during Owner update:', error);
      }
    },

    async deleteOwner(ownerId) {
      try {
        await useApi().delete(`/api/owners/deleteOwner/${ownerId}`);
        this.owners = this.owners.filter(owner => owner.id !== ownerId);
      } catch (error) {
        console.error('Error deleting Owner:', error);
      }
    }
  }
});
