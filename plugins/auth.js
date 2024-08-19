// plugins/auth.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();

  nuxtApp.hook('app:created', () => {
    if (process.client) {
      userStore.initializeFromStorage();
    }
  });

  addRouteMiddleware('auth', (to) => {
    if (to.path !== '/login' && !userStore.isLoggedIn) {
      return navigateTo('/login');
    }
  });

  const token = userStore.getToken;
  if (token) {
    nuxtApp.vueApp.provide('auth_token', token);
    nuxtApp.provide('auth_token', token);
  }
});
