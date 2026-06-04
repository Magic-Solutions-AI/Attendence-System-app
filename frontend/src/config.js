// Central API configuration
// In development (npm run dev), uses localhost backend.
// In production builds (website / Electron packaged), uses the cloud backend.
// Override with VITE_API_BASE_URL env var if needed.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    || (import.meta.env.DEV ? 'http://localhost:8080' : 'https://attendx-s9ju.onrender.com');

export default API_BASE_URL;