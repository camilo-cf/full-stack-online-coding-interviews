import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for DOM testing
    environment: 'jsdom',
    // Setup files for testing utilities
    setupFiles: ['./tests/setup.js'],
    // Include test files pattern
    include: ['tests/**/*.test.{js,jsx}'],
    // Test timeout
    testTimeout: 10000,
    // Globals for cleaner test syntax
    globals: true
  }
});
