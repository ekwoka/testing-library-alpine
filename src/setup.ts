import Alpine from 'alpinejs';

import { render as renderFunc } from './render';
import { waitFor as waitForFunc } from './waitFor';

beforeAll(() => Alpine.start());

afterEach(() => {
  document.body.innerHTML = '';
});

globalThis.render = renderFunc;
globalThis.waitFor = waitForFunc;

declare global {
  // eslint-disable-next-line no-var
  var render: typeof renderFunc;
  // eslint-disable-next-line no-var
  var waitFor: typeof waitForFunc;
}
