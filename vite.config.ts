/// <reference types="vitest" />
import { alpineTestingPlugin } from 'testing-library-alpine';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import ExternalDeps from 'vite-plugin-external-deps';
import WorkspaceSource from 'vite-plugin-workspace-source';
import tsconfigPaths from 'vite-tsconfig-paths';

import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname),
  plugins: [
    dts({
      entryRoot: resolve(__dirname, 'src'),
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
    }),
    tsconfigPaths(),
    ExternalDeps(),
    WorkspaceSource({ isRoot: true }),
    alpineTestingPlugin(),
  ],
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    environment: 'alpine',
    globals: true,
    include: ['./**/*{.spec,.test}.{ts,tsx}'],
    includeSource: ['./packages/**/src/**/*.{ts,tsx}'],
    reporters: ['dot'],
    deps: {},
    setupFiles: [],
  },
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`;
        },
      },
    },
    sourcemap: true,
  },
});
