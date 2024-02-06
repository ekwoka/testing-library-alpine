import { render, waitFor } from '@ekwoka/alpine-testing-library-utilities';
import type { Alpine } from 'alpinejs';

declare global {
  interface Window {
    Alpine: Alpine;
    render: typeof render;
    waitFor: typeof waitFor;
  }
}
