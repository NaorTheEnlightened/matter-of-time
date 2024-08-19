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
    async fetchDesire(id) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) throw new Error('User not authenticated');

      try {
        const { data, error } = await useFetch(`/api/desires/${id}`, {
          headers: userStore.getToken
            ? { Authorization: `Bearer ${userStore.getToken}` }
            : {},
        });
        if (error.value) {
          throw new Error(error.value.message);
        }
        return data.value;
      } catch (error) {
        console.error('Error fetching desire:', error);
        throw error;
      }
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
        // Add null check here
        if (data.value === null) {
          this.desires = [];
        } else {
          this.desires = data.value;
        }
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
        const { data, error } = await useFetch('/api/desires', {
          method: 'POST',
          body: JSON.stringify(desire),
          headers: {
            Authorization: `Bearer ${userStore.getToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (error.value) {
          throw new Error(error.value.message || 'Failed to add desire');
        }

        if (data.value) {
          this.desires.push(data.value);
          return data.value;
        } else {
          throw new Error('Failed to add desire: No data returned');
        }
      } catch (error) {
        console.error('Error adding desire:', error);
        throw error;
      }
    },
    async updateDesire(id, updates) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) throw new Error('User not authenticated');

      try {
        const { data, error } = await useFetch(`/api/desires/${id}`, {
          method: 'PUT',
          body: updates,
          headers: {
            Authorization: `Bearer ${userStore.getToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        const index = this.desires.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.desires[index] = data.value;
        }

        return data.value;
      } catch (error) {
        console.error('Error updating desire:', error);
        this.error = error.message;
        throw error;
      }
    },
    async deleteDesire(id) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) throw new Error('User not authenticated');
      try {
        const { data, error } = await useFetch(`/api/desires/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userStore.getToken}` },
        });

        if (error.value) {
          throw new Error(
            error.value.data.message || 'Failed to delete desire',
          );
        }

        if (data.value && data.value.success) {
          this.desires = this.desires.filter((d) => d.id !== id);
        } else {
          throw new Error('Failed to delete desire');
        }
      } catch (error) {
        console.error('Error deleting desire:', error);
        this.error = error.message;
        throw error;
      }
    },
  },
});
