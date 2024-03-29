# Testing Library: Alpine

All the Environment, Helpers, and Utilities needed to test Alpine components! All built for Vitest!

## Installation

1. Install with PNPM

```sh
pnpm add testing-library-alpine
```

2. Add to `vitest.config.ts`

```ts
import { alpineTestingPlugin } from 'testing-library-alpine';

export default defineConfig({
  plugins: [alpineTestingPlugin()],
});
```

## Runtime Environment

Testing Library: Alpine automatically sets up a DOM/Browser environment (via Happy-DOM) and sets up Alpine in that environment.

It also handles registering test cleanup hooks, and spying on component methods.

### Example Test

```ts
it('Works', () => {
  document.body.append(
    `<div x-data="{ hello: 'world' }" x-text="hello"></div>`,
  );
  Alpine.start();
  expect(document.body.firstElementChild.textContent).toBe('world');
});
```

## Render

Also provided is a `Render` class that can be used to easily and safely instantiate Alpine components within a test.

```ts
it('can check Alpine data Context', async () => {
  const el = await render(`<div x-data="testing" x-text=foo></div>`).withData(
    'testing',
    { foo: 'bar' },
  );
  expect(el).toHaveData({ foo: 'bar' }).toHaveTextContent('bar');
});
```

### `render: (template: string) => Render`

In place of calling the `Render` constructor, `render` is exposed to build a `Render` instance. Just pass in a string of HTML to render.

```ts
const el = await render('<div>hello</div>'); // HTMLDivElement;
```

`Render` provides both a synchronous and asynchronous API for committing the rendered HTML to the DOM and activating Alpine.

#### `Render.commit` (sync)

```ts
() => HTMLElement;
```

`commit` will synchronously commit the HTML to the DOM and initialize the tree with Alpine, immediately returning the root element of the provided string.

```ts
const el = render('<div>hello</div>').commit(); // HTMLDivElement;
```

#### `await Render` / `Render.then(cb: (el: HTMLElement) => void): void` (async)

You can also simply `await` your `Render` instance to render the HTML to the DOM and initialize the tree with Alpine.

This internally calls the `commit` method and then additionally waits for any asynchronous operations in the Alpine/component lifecycle to complete.

```ts
const el = await render('<div>hello</div>'); // HTMLDivElement;
```

### `Render.withPlugin`

```ts
(plugins: PluginCallback | PluginCallback[]) => Render;
```

Mirrors `Alpine.plugin`.

### `Render.withData`

```ts
<T extends Record<string | symbol, unknown>>(
  name: string,
  component: (...args: unknown[]) => AlpineComponent<T>,
) => Render;
```

Mirrors `Alpine.data`.

### `Render.withComponent`

```ts
<T extends Record<string | symbol, unknown>>(
  name: string,
  component: (...args: unknown[]) => AlpineComponent<T>,
) => Render;
```

Mirrors `Alpine.data`.

### `Render.withStore`

```ts
<T extends Record<string | symbol, unknown>>(name: string, store: T) => Render;
```

Mirrors `Alpine.store`.

### `Render.withDirective`

```ts
(name: string, directive: AlpineDirective) => Render;
```

Mirrors `Alpine.directive`.

### `Render.withMagic`

```ts
(
  name: string,
  cb: (
    el: ElementWithXAttributes<HTMLElement>,
    options: MagicUtilities,
  ) => unknown,
) => Render;
```

Mirrors `Alpine.magic`.

## Alpine Assertion

This also introduces a handful of useful assertion methods, to make testing components a bit easier. Some just make testing against the DOM easier (and chainable) and others are more Alpine specific.

### Example

```ts
it('Works', () => {
  document.body.append(
    `<div x-data="{ hello: 'world' }" x-text="hello"></div>`,
  );
  Alpine.start();
  expect(document.body.firstElementChild).toHaveData({ hello: 'world' });
});
```

### `Assertion<T extends HTMLElement>.toHaveData: (expected: Record<string, unknown>) => Assertion<T>`

Checks if the expected object is contained within the context of the provided `HTMLElement`.

This is subset equality, so the objects do not need to directly match, but the expected record must be contained within the Alpine Context of the `HTMLElement`. This also works with deeply nested trees and most common data structures.

```ts
it('can check Alpine data Context', async () => {
  const el = await render(
    "<div x-data=\"{ foo: 'bar', fizz: 'buzz' }\" x-text=foo></div>",
  );
  expect(el)
    .toHaveTextContent('bar')
    .toHaveData({ foo: 'bar' })
    .not.toHaveData({ foo: 'baz' });
});
```

### `Assertion<T extends HTMLElement>.toHaveTextContent: (expected: string) => Assertion<T>`

Checks if an element has exactly matching text content.

```ts
it('can check textContent', async () => {
  const el = await render('<div>hello</div>');
  expect(el).toHaveTextContent('hello').not.toHaveTextContent('goodbye');
});
```

> Note: this trims both the text content of the element, and the expected string.

### `Assertion<T extends HTMLElement>.toContainTextContent: (expected: string) => Assertion<T>`

Checks if an element's text content contains the expected string.

```ts
it('can check textContent', async () => {
  const el = await render('<div>hello</div>');
  expect(el).toContainTextContent('ell').not.toContainTextContent('shello');
});
```

### `Assertion<T extends HTMLElement>.toMatch: (selector: string) => Assertion<T>`

### `Assertion<T extends HTMLElement>.toHaveAttribute: (expectedKey: string, value?: string) => Assertion<T>`

Asserts that an element has an attribute (with optionally provided key).

```ts
it('can check if an element has an attribute', async () => {
  const el = await render('<button type="button" disabled ></button>');
  expect(el)
    .toHaveAttribute('disabled')
    .toHaveAttribute('type', 'button')
    .not.toHaveAttribute('contenteditable');
});
```

> Note: Underneath the hood this uses `HTMLElement.matches` with a constructed CSS Selector.

### `Assertion<T extends HTMLElement>.toHaveClass: (expected: string) => Assertion<T>`

Asserts that an element has the expected class applied.

```ts
it('can check if an element has a class', async () => {
  const el = await render('<div class="foo bar"></div>');
  expect(el).toHaveClass('bar').not.toHaveClass('foobar');
});
```

### `Assertion<T extends HTMLElement>.toHaveStyle: (expected: Partial<CSSStyleDeclaration>) => Assertion<T>`

Asserts an element has a subset of style declarations applied in the style attribute.

```ts
it('can check if an element has style', async () => {
  const el = await render('<div style="color: red;"></div>');
  expect(el).toHaveStyle({ color: 'red' }).not.toHaveStyle({ color: 'blue' });
});
```

### `Assertion<T extends HTMLElement>.toHaveComputedStyle: (expected: Partial<CSSStyleDeclaration>) => Assertion<T>`

Asserts an element has a subset of style declarations from inline css, class names, css selecters, default styles.

```ts
it('can check if an element has a computed style', async () => {
  const el = await render('<div style="color: red;"></div>');
  expect(el)
    .toHaveComputedStyle({ display: 'block' })
    .not.toHaveComputedStyle({ display: 'inline' });
});
```

### `Assertion<T extends HTMLElement>.toBeVisible: () => Assertion<T>`

Asserts an element does not have `display: none`.

```ts
it('can check if an element is visible', async () => {
  const el = await render(
    '<div x-data="{ show: true }"><span x-show="show"></span><span x-show="!show"></span></div>',
  );
  expect(el.children[0]).toBeVisible().not.toBeHidden();
  expect(el.children[1]).toBeHidden().not.toBeVisible();
});
```

### `Assertion<T extends HTMLElement>.toBeHidden: () => Assertion<T>`

Asserts an element has `display: none`.

```ts
it('can check if an element is visible', async () => {
  const el = await render(
    '<div x-data="{ show: true }"><span x-show="show"></span><span x-show="!show"></span></div>',
  );
  expect(el.children[0]).toBeVisible().not.toBeHidden();
  expect(el.children[1]).toBeHidden().not.toBeVisible();
});
```

### `Assertion<T extends HTMLElement>.toHaveNChildren: (expected: number) => Assertion<T>`

Asserts an element has the expected number of children.

```ts
it('can check if an element has N children', async () => {
  const el = await render('<div><span></span><span></span></div>');
  expect(el).toHaveNChildren(2).not.toHaveNChildren(1).toHaveNChildren(3);
});
```
