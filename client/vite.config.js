import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    "global": {},
  }
  ,
  optimizeDeps: {
    exclude: ['bcrypt'],
  },
})
