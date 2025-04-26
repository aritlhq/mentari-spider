import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  /**
   * Reference: 
   * https://mookypoo.medium.com/nuxt-js-how-to-handle-cors-error-a4c5022611d0
   */
  routeRules: {
    '/api/mentari/**': {
      proxy: { to: 'https://mentari.unpam.ac.id/api/**' }
    }
  }
})
