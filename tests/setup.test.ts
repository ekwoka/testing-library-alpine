import { expect } from 'vitest';

describe('Setup', () => {
  it('initializes Alpine', () => {
    expect(globalThis).toHaveProperty('Alpine');
  });
  it('has globals', () => {
    expect(globalThis).toHaveProperty('render');
    expect(globalThis).toHaveProperty('waitFor');
  });
  it('has a document', () => {
    expect(globalThis).toHaveProperty('window');
    expect(window).toHaveProperty('document');
    expect(document).toHaveProperty('body');
    document.body.innerHTML = '<div>Hello</div>';
    expect(document.querySelector('div')!.textContent).toBe('Hello');
  });
  it('clears the document between tests', () => {
    expect(document.querySelector('div')).toBeNull();
    expect(document.body.innerHTML).toBe('');
  });
  it('spies on component methods', async () => {
    await render(`
      <div x-data="foo">
        <button x-on:click="increment">Increment</button>
        <span x-text="count.toString()"></span>
      </div>
    `).withComponent('foo', () => ({
      count: 0,
      increment() {
        this.count++;
      },
    }));
    const data = getData<{ count: number; increment(): void }>();
    expect(data.increment).toBeCalledTimes(0);
    const button = document.querySelector('button')!;
    const span = document.querySelector('span')!;
    await waitFor(span).toHaveText('0');
    button.click();
    await waitFor(span).toHaveText('1');
    expect(data.increment).toBeCalledTimes(1);
  });
});
