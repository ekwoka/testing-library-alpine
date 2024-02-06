import { render, waitFor } from '@ekwoka/alpine-testing-library-utilities';
import type { Alpine } from 'alpinejs';
import type { IWindow } from 'happy-dom';

declare global {
  interface Window {
    Alpine: Alpine;
    render: typeof render;
    waitFor: typeof waitFor;
    happyDom: IWindow['happyDOM'];
  }
}
