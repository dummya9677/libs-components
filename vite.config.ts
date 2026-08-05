import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || '/api';
  const usesRelativeApi = apiBaseUrl.startsWith('/');

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      open: false,
      // Only used when VITE_API_BASE_URL=/api. For a full backend URL, requests go direct.
      ...(usesRelativeApi
        ? {
            proxy: {
              '/api': {
                target:
                  env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
              },
            },
          }
        : {}),
    },
  };
});
