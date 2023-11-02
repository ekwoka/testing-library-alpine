import { render } from '../src/render';
import utilities from '../src/utilities';

describe('testing library', () => {
  it('should render component', async () => {
    await render(`
      <div x-data="{ count: 0 }">
        <button x-on:click="count++">Increment</button>
        <span x-text="count"></span>
      </div>
    `);
    const button = document.querySelector('button')!;
    const span = document.querySelector('span')!;
    await waitFor(span).toHaveText('0');
    button.click();
    await waitFor(span).toHaveText('1');
  });
  it('has utilities', async () => {
    await render(`<div x-data="{ count: 1 }">
        <button x-on:click="count++">Increment</button>
        <span x-text="count"></span>
      </div>`);

    const button = document.querySelector('button')!;
    const span = document.querySelector('span')!;
    await waitFor(span).toHaveText('1');
    expect(utilities.getData('span').toJSON()).toEqual({ count: 1 });
    utilities.setData('count', 2);
    await waitFor(span).toHaveText('2');
  });
});

/**
 * render(html)
 * Alpine
 */
