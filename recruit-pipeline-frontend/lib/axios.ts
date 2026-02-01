import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
        // Redux Persists saves it under 'persist:root' as stringified JSON
        // but we kept manual localStorage in authSlice setCredentials for a moment? 
        // No, I removed it. Redux Persist will handle the store.
        // However, the interceptor often runs before the component tree is fully hydrated.
        // Redux Persist storage engine is localStorage by default.
        // Let's see how it's stored. key is 'persist:root'.
        try {
            const persistRoot = localStorage.getItem('persist:root');
            if (persistRoot) {
                const authState = JSON.parse(JSON.parse(persistRoot).auth);
                const token = authState.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch {
            // Fallback to manual if needed or just silent fail
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
