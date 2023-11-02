/* eslint-disable no-var */
import Alpine from 'alpinejs';

import { render as renderFunc } from './render';
import { waitFor as waitForFunc } from './waitFor';

type AlpineType = typeof Alpine;
beforeAll(() => Alpine.start());

afterEach(() => {
  document.body.innerHTML = '';
});

globalThis.Alpine = Alpine;
globalThis.render = renderFunc;
globalThis.waitFor = waitForFunc;

declare global {
  var render: typeof renderFunc;
  var waitFor: typeof waitForFunc;
  var Alpine: AlpineType;
}
