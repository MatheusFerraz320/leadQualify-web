import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'leads-route-spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const accept = req.headers.accept ?? ''
          if (
            accept.includes('text/html') &&
            (req.url ?? '').startsWith('/leads')
          ) {
            req.url = '/'
          }
          next()
        })
      },
    },
  ],
  server: {
    proxy: {
      '/auth': {
        target: process.env.VITE_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
      '/users': {
        target: process.env.VITE_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
      '/leads': {
        target: process.env.VITE_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
      '/dashboard': {
        target: process.env.VITE_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
