import type { Environment } from 'vitest';
import { builtinEnvironments } from 'vitest/environments';

import { spyOnAlpine } from './spyOnAlpine';

const happyDomEnv = builtinEnvironments['happy-dom'];

export default {
  name: 'alpine',
  transformMode: 'web',
  async setupVM(options) {
    const happyDomSetup = await happyDomEnv.setupVM(options);
    const Alpine = await import('alpinejs').then((mod) => mod.default);

    Alpine.plugin(spyOnAlpine);

    return {
      getVmContext() {
        const win = happyDomSetup.getVmContext();
        return Object.assign(win, { Alpine });
      },
      async teardown() {
        await happyDomSetup.teardown();
      },
    };
  },
  async setup(global, options) {
    const happyDomSetup = await happyDomEnv.setup(global, options);
    const Alpine = await import('alpinejs').then((mod) => mod.default);

    Alpine.plugin(spyOnAlpine);
    const { render, waitFor } = await import(
      '@ekwoka/alpine-testing-library-utilities'
    );
    Object.assign(global, {
      Alpine,
      render,
      waitFor,
    });

    return {
      teardown(global) {
        delete global.Alpine;
        happyDomSetup.teardown(global);
      },
    };
  },
} satisfies Environment;
