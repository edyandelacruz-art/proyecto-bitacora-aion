import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@aion/design-tokens': path.resolve(__dirname, '../../packages/aion-design-tokens'),
      '@aion/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@aion/protocol': path.resolve(__dirname, '../../packages/aion-protocol/src'),
      '@aion/memory': path.resolve(__dirname, '../../packages/aion-memory/src'),
      '@aion/agents': path.resolve(__dirname, '../../packages/aion-agents/src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
