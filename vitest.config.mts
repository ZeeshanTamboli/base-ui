import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(CURRENT_DIR, './');

export default defineConfig({
  test: {
    workspace: [
      'packages/*/vitest.config.mts',
      'docs/vitest.config.mts',
      'test/e2e/vitest.config.mts',
      'test/regressions/vitest.config.mts',
    ],
    coverage: {
      provider: 'istanbul',
      reporter: [['text', { maxCols: 200 }], 'lcov'],
      reportsDirectory: resolve(WORKSPACE_ROOT, 'coverage'),
      include: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
      exclude: ['**/*.test.{js,ts,tsx}', '**/*.test/*'],
    },
  },
});
