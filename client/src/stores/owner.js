import { defineStore } from 'pinia';
import { useApi } from "../composables/useApi.js";

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
        const { data } = await useApi().post('/api/owners/createOwner', payload);
        this.owners.push(data);
        return data;
      } catch (error) {
        console.error('Error during Owner creation:', error);
      }
    },

    async getOwners() {
      try {
        const { data } = await useApi().get('/api/owners/getOwners');
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
