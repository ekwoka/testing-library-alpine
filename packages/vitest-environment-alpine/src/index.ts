import { importModule } from 'local-pkg';
import type { Environment } from 'vitest';
import { builtinEnvironments, populateGlobal } from 'vitest/environments';

const happyDomEnv = builtinEnvironments['happy-dom'];

export default {
  name: 'alpine',
  transformMode: 'web',
  async setupVM(options) {
    const happyDomSetup = await happyDomEnv.setupVM(options);
    const Alpine = await importModule<typeof import('alpinejs')>('alpinejs');

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
    const Alpine = await importModule<typeof import('alpinejs')>('alpinejs');
    const { keys, originals } = populateGlobal(
      global,
      { Alpine },
      { bindFunctions: true },
    );

    return {
      teardown(global) {
        keys.forEach((key) => delete global[key]);
        originals.forEach((v, k) => (global[k] = v));
        happyDomSetup.teardown(global);
      },
    };
  },
} satisfies Environment;
