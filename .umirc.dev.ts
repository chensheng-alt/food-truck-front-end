import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    ENV_BASE_URL: '/food-truck-frontend-api',
    REQUEST_TIME_OUT: 10000,
  },
  proxy: {
    '/food-truck-frontend-api': {
      target: 'http://localhost:8011',
      changeOrigin: true,
      pathRewrite: { '^/food-truck-frontend-api': '' },
    },
  },
});
