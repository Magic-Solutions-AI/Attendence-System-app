import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

/**
 * Custom plugin: strips the `crossorigin` attribute that Vite automatically
 * injects on every <script type="module"> and <link rel="stylesheet"> tag.
 *
 * WHY THIS IS NEEDED:
 *   When the packaged Electron app loads renderer/index.html via file:// protocol,
 *   Chromium enforces CORS for any tag with `crossorigin`. Since file:// has a
 *   null origin, CORS is always denied → the JS bundle and CSS never load →
 *   blank white page. Removing the attribute tells Chromium to skip CORS and
 *   load the file normally.
 */
function removeElectronCrossorigin() {
  return {
    name: 'remove-crossorigin-for-electron',
    transformIndexHtml(html) {
      return html
        .replace(/ crossorigin="[^"]*"/g, '')
        .replace(/ crossorigin/g, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // './' is required for Electron file:// protocol to resolve relative paths
  base: './',
  plugins: [react(), tailwindcss(), removeElectronCrossorigin()],
  build: {
    // KEY FIX: output to renderer/ not dist/
    // electron-builder excludes its own output dir (dist/) from the ASAR
    // by default. By building to renderer/, the React app is always
    // packaged correctly inside the installer.
    outDir: 'renderer',
    rollupOptions: {
      output: {},
    },
    // Disable automatic modulepreload polyfill injection (also adds crossorigin)
    modulePreload: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://attendx-s9ju.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
