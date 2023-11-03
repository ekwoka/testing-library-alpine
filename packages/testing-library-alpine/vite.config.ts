/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
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
  ],
  define: {
    'import.meta.vitest': 'undefined',
    'import.meta.DEBUG': 'false',
  },
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: [
        resolve(__dirname, 'src', 'index.ts'),
        resolve(__dirname, 'src', 'setup.ts'),
      ],
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
        sourcemap: true,
      },
      external: [/node_modules/, /node:/],
    },
  },
  test: {
    globals: true,
    include: ['./**/*{.spec,.test}.{ts,tsx}'],
    includeSource: ['./**/*.{ts,tsx}'],
    reporters: ['dot'],
    deps: {},
    useAtomics: true,
    passWithNoTests: true,
  },
});
