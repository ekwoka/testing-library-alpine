import type { ExpectStatic } from 'vitest';

export const upgradeExpect = (expect: ExpectStatic) => {
  expect.extend({
    toHaveTextContent(received: HTMLElement, expected: string) {
      const actual = received.textContent;
      return {
        pass: actual === expected,
        message: () => `expected ${received} to have text content ${expected}`,
      };
    },
  });
};
