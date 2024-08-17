// stores/desire.js
import { defineStore } from 'pinia';

export const useDesireStore = defineStore('desire', {
  state: () => ({
    desires: [],
    loading: false,
    error: null,
    dataFetched: false,
  }),
  actions: {
    getUserId() {
      if (process.client) {
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          return user.id;
        }
      }
      return null;
    },
    resetState() {
      this.desires = [];
      this.loading = false;
      this.error = null;
      this.dataFetched = false;
    },
    async fetchDesires() {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        this.resetState();
        return;
      }

      this.loading = true;
      try {
        const { data, error } = await useFetch('/api/desires', {
          headers: userStore.getToken
            ? { Authorization: `Bearer ${userStore.getToken}` }
            : {},
        });
        if (error.value) {
          throw new Error(error.value.message);
        }
        this.desires = data.value;
        this.dataFetched = true;
      } catch (error) {
        console.error('Error fetching desires:', error);
        this.error = error.message;
        if (error.message.includes('Unauthorized')) {
          userStore.clearUser(); // Log out the user if the token is invalid
        }
      } finally {
        this.loading = false;
      }
    },

    async addDesire(desire) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) throw new Error('User not authenticated');

      try {
        const { data } = await useFetch('/api/desires', {
          method: 'POST',
          body: desire,
          headers: { Authorization: `Bearer ${userStore.getToken}` },
        });
        this.desires.push(data.value);
        return data.value;
      } catch (error) {
        console.error('Error adding desire:', error);
        throw error;
      }
    },
    async updateDesire(id, updates) {
      try {
        const userId = this.getUserId();
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await useFetch(`/api/desires/${id}`, {
          method: 'PUT',
          body: updates,
          headers: { 'user-id': userId.toString() },
        });
        if (error.value) {
          throw new Error(error.value.message);
        }
        const index = this.desires.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.desires[index] = data.value;
        }
      } catch (error) {
        console.error('Error updating desire:', error);
        this.error = error.message;
        throw error;
      }
    },
    async deleteDesire(id) {
      try {
        const userId = this.getUserId();
        if (!userId) throw new Error('User not authenticated');

        const { error } = await useFetch(`/api/desires/${id}`, {
          method: 'DELETE',
          headers: { 'user-id': userId.toString() },
        });
        if (error.value) {
          throw new Error(error.value.message);
        }
        this.desires = this.desires.filter((d) => d.id !== id);
      } catch (error) {
        console.error('Error deleting desire:', error);
        this.error = error.message;
        throw error;
      }
    },
  },
});
