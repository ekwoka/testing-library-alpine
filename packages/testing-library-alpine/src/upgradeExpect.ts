import type { Assertion, ExpectStatic } from 'vitest';

export const upgradeExpect = (expect: ExpectStatic) => {
  expect.extend({
    toHaveTextContent(el: HTMLElement, expected: string) {
      const actual = el.textContent;
      return {
        pass: actual === expected,
        message: () =>
          `expected ${el.tagName} ${this.isNot ? 'not to' : 'to'} have text content ${expected}.\n${this.utils.diff(expected, actual)}`,
      };
    },
    toContainTextContent(el: HTMLElement, expected: string) {
      const actual = el.textContent;
      return {
        pass: actual?.includes(expected),
        message: () =>
          `expected ${el.tagName} to contain text content ${expected}\n${this.utils.diff(expected, actual)}`,
      };
    },
    toHaveAttribute(el: HTMLElement, expectedKey: string, value?: string) {
      const selector = `[${expectedKey}${value ? `="${value}"` : ''}]`;
      return {
        pass: el.matches(selector),
        message: () =>
          `expected ${el.tagName} to match ${selector} but it didn't`,
      };
    },
    toHaveClass(el: HTMLElement, expected: string) {
      return {
        pass: el.classList.contains(expected),
        message: () =>
          `expected ${el.tagName} to have class ${expected} but it didn't`,
      };
    },
    toHaveStyle(el: HTMLElement, expected: Partial<CSSStyleDeclaration>) {
      const actual = el.style;
      return {
        pass: makeSafe(this.utils).subsetEquality(actual, expected, []),
        message: () =>
          `expected ${el.tagName} to have style ${JSON.stringify(expected)}.
${this.utils.diff(expected, actual)}`,
      };
    },
    toHaveComputedStyle(
      el: HTMLElement,
      expected: Partial<CSSStyleDeclaration>,
    ) {
      const actual = window.getComputedStyle(el);
      return {
        pass: makeSafe(this.utils).subsetEquality(actual, expected, []),
        message: () =>
          `expected ${el.tagName} to have computed style ${JSON.stringify(expected)}.
${this.utils.diff(expected, actual)}`,
      };
    },
    toBeVisible(el: HTMLElement) {
      const { display } = window.getComputedStyle(el);
      return {
        pass: display !== 'none',
        message: () => `expected ${el.tagName} to be visible but it wasn't`,
      };
    },
    toBeHidden(el: HTMLElement) {
      const { display } = window.getComputedStyle(el);
      return {
        pass: display === 'none',
        message: () => `expected ${el.tagName} to be visible but it wasn't`,
      };
    },
    toHaveNChildren(el: HTMLElement, expected: number) {
      return {
        pass: el.children.length === expected,
        message: () =>
          `expected ${el.tagName} to have ${expected} children but it didn't`,
      };
    },
    toHaveData(el: HTMLElement, expected: Record<string, unknown>) {
      const actual = (
        window.Alpine.$data(el) as { toJSON(): unknown }
      ).toJSON();
      return {
        pass: makeSafe(this.utils).subsetEquality(actual, expected, []),
        message: () =>
          `expected ${el.tagName} to contain data ${JSON.stringify(expected)}.
${this.utils.diff(expected, actual)}`,
      };
    },
  });
};

if (import.meta.vitest) {
  upgradeExpect(expect);
  it('can check textContent', async () => {
    const el = await globalThis.render('<div>hello</div>');
    expect(el)
      .toHaveTextContent('hello')
      .toContainTextContent('ell')
      .not.toHaveTextContent('goodbye')
      .toContainTextContent('shello');
  });
  it('can check Alpine data Context', async () => {
    const el = await globalThis.render(
      "<div x-data=\"{ foo: 'bar', fizz: 'buzz' }\" x-text=foo></div>",
    );
    expect(el)
      .toHaveTextContent('bar')
      .toHaveData({ foo: 'bar' })
      .not.toHaveData({ foo: 'baz' });
  });
  it('can check if an element has an attribute', async () => {
    const el = await globalThis.render(
      '<button type="button" disabled ></button>',
    );
    expect(el)
      .toHaveAttribute('disabled')
      .toHaveAttribute('type', 'button')
      .not.toHaveAttribute('contenteditable');
  });
  it('can check if an element has a class', async () => {
    const el = await globalThis.render('<div class="foo bar"></div>');
    expect(el).toHaveClass('bar').not.toHaveClass('foobar');
  });
  it('can check if an element has style', async () => {
    const el = await globalThis.render('<div style="color: red;"></div>');
    expect(el).toHaveStyle({ color: 'red' }).not.toHaveStyle({ color: 'blue' });
  });
  it('can check if an element has a computed style', async () => {
    const el = await globalThis.render('<div style="color: red;"></div>');
    expect(el)
      .toHaveComputedStyle({ display: 'block' })
      .not.toHaveComputedStyle({ display: 'inline' });
  });
  it('can check if an element is visible', async () => {
    const el = await globalThis.render(
      '<div x-data="{ show: true }"><span x-show="show"></span><span x-show="!show"></span></div>',
    );
    expect(el.children[0]).toBeVisible().not.toBeHidden();
    expect(el.children[1]).toBeHidden().not.toBeVisible();
  });
  it('can check if an element has N children', async () => {
    const el = await globalThis.render('<div><span></span><span></span></div>');
    expect(el).toHaveNChildren(2).not.toHaveNChildren(1).toHaveNChildren(3);
  });
}

interface AlpineMatchers<T> {
  toHaveData: (expected: Record<string, unknown>) => Assertion<T>;
  toHaveTextContent: (expected: string) => Assertion<T>;
  toContainTextContent: (expected: string) => Assertion<T>;
  toMatch: (selector: string) => Assertion<T>;
  toHaveAttribute: (expectedKey: string, value?: string) => Assertion<T>;
  toHaveClass: (expected: string) => Assertion<T>;
  toHaveStyle: (expected: Partial<CSSStyleDeclaration>) => Assertion<T>;
  toHaveComputedStyle: (expected: Partial<CSSStyleDeclaration>) => Assertion<T>;
  toBeVisible: () => Assertion<T>;
  toBeHidden: () => Assertion<T>;
  toHaveNChildren: (expected: number) => Assertion<T>;
}

const makeSafe = <T>(utils: T) =>
  utils as T & {
    equals: (
      a: unknown,
      b: unknown,
      customTesters?: Array<unknown>,
      strictCheck?: boolean,
    ) => boolean;
  };

declare module 'vitest' {
  interface Assertion<T> extends AlpineMatchers<T> {}
}
