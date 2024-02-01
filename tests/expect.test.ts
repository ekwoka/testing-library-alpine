import { Assertion } from 'vitest';

import { upgradeExpect } from '../packages/testing-library-alpine/src/upgradeExpect';

upgradeExpect(expect);
describe('expect extended', () => {
  it('hasTextContent', () => {
    const el = document.createElement('div');
    el.textContent = 'hello';
    expect(el).toHaveTextContent('hello');
  });
});
interface CustomMatchers {
  toHaveTextContent<T extends HTMLElement>(
    this: Assertion<T>,
    text: string,
  ): Assertion<T>;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<T = any> extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
