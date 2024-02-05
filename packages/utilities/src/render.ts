import {
  AlpineComponent,
  ElementWithXAttributes,
  MagicUtilities,
  PluginCallback,
  Stores,
} from 'alpinejs';

export const render = (html: string) => new Render(html);
const started = Symbol('Alpine Initialized');
class Render {
  private html: string;
  constructor(html: string) {
    this.html = html;
  }
  withPlugin(plugin: PluginCallback) {
    plugin(window.Alpine);
    return this;
  }
  withComponent<T extends Record<string | symbol, unknown>>(
    name: string,
    component: (...args: unknown[]) => AlpineComponent<T>,
  ) {
    window.Alpine.data(name, component);
    return this;
  }
  withMagic(
    name: string,
    cb: (
      el: ElementWithXAttributes<HTMLElement>,
      options: MagicUtilities,
    ) => unknown,
  ) {
    window.Alpine.magic(name, cb);
    return this;
  }
  withStore<T extends keyof Stores>(name: T, store: Stores[T]) {
    window.Alpine.store(name, store);
    return this;
  }
  commit() {
    if (window.Alpine[started]) {
      window.Alpine.stopObservingMutations();
      window.Alpine.destroyTree(document.body);
    } else {
      window.Alpine[started] = true;
    }
    document.body.innerHTML = this.html;
    window.Alpine.startObservingMutations();
    window.Alpine.initTree(document.body);
    return document.body.firstChild!;
  }
  then(cb: (el: Node) => void) {
    const root = this.commit();

    return Promise.resolve(cb(root));
  }
}

if (import.meta.vitest) {
  describe('Render', () => {
    it('renders', () => {
      render('<div>Hello</div>').commit();
      expect(document.querySelector('div')!.textContent).toBe('Hello');
    });
    it('returns the root synchronously', () => {
      const root = render('<div>Hello</div>').commit();
      expect(root).toBe(document.querySelector('div'));
    });
    it('can be awaited', async () => {
      await render('<div>World</div>');
      expect(document.querySelector('div')!.textContent).toBe('World');
    });
    it('returns the root asynchronously', async () => {
      const root = await render('<div>World</div>');
      expect(root).toBe(document.querySelector('div'));
    });
    it('can add components', async () => {
      const root = await render('<div x-data="foobar"></div>').withComponent(
        'foobar',
        () => ({ count: 1 }),
      );
      expect(window.Alpine.$data(root as HTMLElement)).toHaveProperty(
        'count',
        1,
      );
    });
    it('can add stores', async () => {
      const root = await render(
        '<div x-data x-text="$store.foo.bar"></div>',
      ).withStore('foo', { bar: 'fizzbuzz' });
      expect(root).toHaveProperty('textContent', 'fizzbuzz');
    });
    it('can add magic', async () => {
      const root = await render(
        '<div x-data="{ count: 0 }" x-text="$foo"></div>',
      ).withMagic('foo', () => 'bar');
      expect(root).toHaveProperty('textContent', 'bar');
    });
    it('can add plugins', async () => {
      const root = await render(
        '<div x-data="foo" x-text="fizz"></div>',
      ).withPlugin((Alpine) => {
        Alpine.data('foo', () => ({ fizz: 'buzz' }));
      });
      expect(root).toHaveProperty('textContent', 'buzz');
    });
  });
}
