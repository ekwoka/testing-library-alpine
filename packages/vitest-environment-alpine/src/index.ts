import type { Alpine } from 'alpinejs';
import type { Environment } from 'vitest';
import { builtinEnvironments } from 'vitest/environments';

import { spyOnAlpine } from './spyOnAlpine';

const happyDomEnv = builtinEnvironments['happy-dom'];

export default {
  name: 'alpine',
  transformMode: 'web',
  async setupVM(options) {
    const happyDomSetup = await happyDomEnv.setupVM?.(options);
    const Alpine = await getAlpine();

    Alpine.plugin(spyOnAlpine);

    return {
      getVmContext() {
        const win = happyDomSetup?.getVmContext() ?? {};
        return Object.assign(win, { Alpine });
      },
      async teardown() {
        await happyDomSetup?.teardown();
      },
    };
  },
  async setup(global, options) {
    const happyDomSetup = await happyDomEnv.setup(global, options);
    const Alpine = await getAlpine();

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
        delete global.render;
        delete global.waitFor;
        happyDomSetup.teardown(global);
      },
    };
  },
} satisfies Environment;

const getAlpine = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let AlpineModule: any = await import('alpinejs');

  while ('Alpine' in AlpineModule || 'default' in AlpineModule) {
    AlpineModule = AlpineModule.default ?? AlpineModule.Alpine;
  }
  return AlpineModule as Alpine;
};
