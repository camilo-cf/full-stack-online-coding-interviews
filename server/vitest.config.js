import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run tests in sequence to avoid port conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // Timeout for async tests (Socket.IO tests may need more time)
    testTimeout: 10000,
    // Hook timeout
    hookTimeout: 10000
  }
});
