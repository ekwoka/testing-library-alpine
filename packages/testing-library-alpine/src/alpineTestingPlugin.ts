import type { Plugin } from 'vite';

import { relative } from 'node:path';

console.log(
  `./${relative(
    process.cwd(),
    import.meta.resolve('testing-library-alpine/setup').replace('file://', ''),
  )}`,
);
export const alpineTestingPlugin = (): Plugin => ({
  name: 'Alpine Testing Library',
  apply: 'serve',
  config: () => ({
    test: {
      environment: 'happy-dom',
      setupFiles: [
        `./${relative(
          process.cwd(),
          import.meta
            .resolve('testing-library-alpine/setup')
            .replace('file://', ''),
        )}`,
      ],
    },
  }),
});
