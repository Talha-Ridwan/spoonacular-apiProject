import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Make sure to import Tailwind CSS

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Add Tailwind CSS plugin here
  ]
});
