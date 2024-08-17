// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    externals: {
      inline: ['@prisma/client'],
    },
  },
  build: {
    transpile: ['@prisma/client'],
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  debug: true,
  // colorMode: {
  //   preference: 'light', // default value of $colorMode.preference
  // },
  plugins: ['~/plugins/prisma.js', '~/plugins/auth.js'],
  sourcemap: {
    server: true,
    client: true,
  },
  runtimeConfig: {
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api',
    },
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-vue3-google-signin',
  ],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});
