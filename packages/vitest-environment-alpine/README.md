# Vitest Environment: Alpine

An Environment to make testing the behavior of Alpine Components/Plugins/Tools, etc very simple! For Vitest!

> Note: It is recommended that you do not directly install and manage this environment, but instead use `testing-library-alpine` to handle adding this environment, handling some additional setup, and providing useful helpers.

## Installation

Just install with pnpm!

```sh
pnpm add vitest-environment-alpine
```

And add it as an environment to your `vite.config.ts`

```ts
export default defineConfig({
  test: {
    environment: 'alpine',
  },
});
```

If you just add `alpine` to the environment, `vitest` will ask you if you want to install it.

Alternatively, you can define per test file which environment to use with

```ts
// @vitest-environment jsdom
```

at the top of a file.

## Usage

Inside test files, you'll have access to all the normal DOM/Browser APIs.

> Note: DOM and Browser APIs are provided and implemented by Happy-DOM through the vitest builtin Happy-DOM environment. These are just tested against Alpine to ensure they will work.

```ts
it('has a document', () => {
  document.body.append('<div>Hello World</div>');
  expect(document.body.firstElementChild.textContent).toBe('Hello World');
});
```

Naturally, Alpine is also already added and set up, accessible on the global scope!

```ts
it('has Alpine', () => {
  document.body.append(
    '<div x-data="{ foo: `bar` }" x-text="foo">Hello World</div>',
  );
  Alpine.start();
  expect(document.body.firstElementChild.textContent).toBe('bar');
});
```

## Setup Teardown

Due to how Alpine renders on the document, its worthwhile to only call `Alpine.start` once, and instead use some other methods to handle resetting the state for each test. Or setup the test plugins/data/stores etc once in the parent suite.

To have manual test resetting, you can add the following

```ts
beforeEach(() => {
  Alpine.startObservingMutations();
});
afterEach(() => {
  Alpine.stopObservingMutations();
  Alpine.destroyTree(document.body);
  document.body.replaceChildren();
});
Alpine.start();
```

To your tests.

If you use `testing-library-alpine` this behavior is handled automatically and you can safely use the `render` helper without worry.

## Spying on component methods

Automatically, methods on components are wrapped in `vi.fn` so that you can use spy on their usages.

```ts
it('has Alpine', () => {
  document.body.append(
    '<div x-data="{ foo() { return `bar` } }" x-text="foo()">Hello World</div>',
  );
  Alpine.start();
  expect(
    Alpine.$data(document.body.firstElementChild).foo,
  ).toHaveBeenCalledTimes(1);
});
```
