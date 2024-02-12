import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Change this to a valid IP address if needed
    proxy: {
      "/api": "http://localhost:5001",
    }
  } ,
  plugins: [react()],
})
