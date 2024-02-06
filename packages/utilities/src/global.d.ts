import type { Alpine } from 'alpinejs';
import type { IWindow } from 'happy-dom';

declare global {
  interface Window {
    Alpine: Alpine;
    happyDOM: IWindow['happyDOM'];
  }
}
