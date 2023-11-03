import Alpine, { ElementWithXAttributes } from 'alpinejs';
import { Assertion } from 'vitest';

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export const click = async <El extends HTMLElement>(selector: string) => {
  const el = $<El>(selector)!;
  el.click();
  await Alpine.nextTick();
  return el;
};

export const type = async <El extends HTMLInputElement | HTMLTextAreaElement>(
  selector: string,
  value: string,
) => {
  const el = $<El>(selector)!;
  el.value = value;
  el.dispatchEvent(new InputEvent('input'));
  await Alpine.nextTick();
  return el;
};

export const getData = <Data extends Record<string | symbol, unknown>>(
  selector = '[x-data]',
) => {
  const data = Alpine.$data($<ElementWithXAttributes>(selector)!) as Data;
  return data;
};

export const setData = <Data extends Record<string | symbol, unknown>>(
  key: string | string[],
  value: unknown | ((data: Data) => void),
  selector = '[x-data]',
) => {
  if (typeof key === 'string') key = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = Alpine.$data($<ElementWithXAttributes>(selector)!);
  while (key.length > 1) data = data?.[key.shift()!];
  if (typeof value === 'function') value(data[key[0]]);
  else data[key[0]] = value;
  return Alpine.nextTick();
};

export const expectData = <Data extends Record<string | symbol, unknown>>(
  selector = '[x-data]',
) => {
  const data = Alpine.$data($<ElementWithXAttributes>(selector)!) as {
    toJSON: () => Data;
  };
  return expect(data.toJSON()) as Assertion<Data>;
};

export const utilities = {
  $,
  $$,
  click,
  type,
  getData,
  setData,
  expectData,
};

if (import.meta.vitest) {
  describe('utilities', () => {
    it('can querySelector(All)', async () => {
      await render('<div>hello</div>');
      expect($('div')).not.toBeNull();
      expect($$('div').length).toBe(1);
    });
    it('can click', async () => {
      const btn = await render(
        '<button x-data="{ count: 1 }" x-on:click="count++" x-text="count"></button>',
      );

      await click('button');
      expect(btn).toHaveProperty('textContent', '2');
    });
    it('can type', async () => {
      await render(`
        <div x-data="{ value: '', didInput: false }">
          <input x-model="value"  @input="didInput = true">
          <span x-text="value"></span>
          <span id="inputted" x-text="didInput.toString()"></span>
        </div>
      `);
      await type('input', 'hello');
      expect($('span')).toHaveProperty('textContent', 'hello');
      expect($('span#inputted')).toHaveProperty('textContent', 'true');
    });
    it('can getData', async () => {
      await render('<div x-data="{ count: 1 }"></div>');
      const data = getData();
      expect(data).toHaveProperty('count', 1);
    });
    it('can setData', async () => {
      await render('<div x-data="{ count: 1 }" x-text="count"></div>');
      await setData('count', 2);
      expect($('div')).toHaveProperty('textContent', '2');
    });
    it('can expectData', async () => {
      await render('<div x-data="{ count: 1 }" x-text="count"></div>');
      expectData().toEqual({ count: 1 });
    });
  });
}
