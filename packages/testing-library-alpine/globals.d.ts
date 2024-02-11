/* eslint-disable no-var */
import { render, waitFor } from '@ekwoka/alpine-testing-library-utilities';
import type { Alpine } from 'alpinejs';

interface AlpineTestingGlobals {
  Alpine: Alpine;
  render: typeof render;
  waitFor: typeof waitFor;
}

declare global {
  var Alpine: Alpine;
  var render: typeof render;
  var waitFor: typeof waitFor;
  interface Window extends AlpineTestingGlobals {}
  var globalThis: Window & typeof globalThis;
}
