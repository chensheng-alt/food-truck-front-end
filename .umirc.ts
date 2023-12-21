import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  locale: {
    default: 'en-US',
    baseSeparator: '-',
  },
  npmClient: 'npm',
  plugins: ['./src/plugins/BMap']
});

