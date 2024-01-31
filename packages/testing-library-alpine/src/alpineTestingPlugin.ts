import type { Plugin } from 'vite';

import { relative } from 'node:path';

export const alpineTestingPlugin = (): Plugin => ({
  name: 'Alpine Testing Library',
  apply: 'serve',
  config: () => ({
    test: {
      environment: 'alpine',
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
