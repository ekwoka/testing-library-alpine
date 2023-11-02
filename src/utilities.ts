import Alpine, { ElementWithXAttributes } from 'alpinejs';

export const utilities: AlpineTestUtilities = {
  Alpine: Alpine,
  $: document.querySelector.bind(document),
  $$: document.querySelectorAll.bind(document),
  async click<T extends HTMLElement>(selector: string) {
    const el = this.$<T>(selector)!;
    el.click();
    await Alpine.nextTick();
    return el;
  },
  async type<T extends HTMLInputElement | HTMLTextAreaElement>(
    selector: string,
    value: string,
  ) {
    const el = this.$<T>(selector)!;
    el.value = value;
    el.dispatchEvent(new InputEvent('input'));
    await Alpine.nextTick();
    return el;
  },
  getData<Data extends Record<string | symbol, unknown>>(
    selector = '[x-data]',
  ) {
    const data = Alpine.$data(
      this.$<ElementWithXAttributes>(selector)!,
    ) as Data;
    return data;
  },
  setData<Data extends Record<string | symbol, unknown>>(
    key: string | string[],
    value: unknown | ((data: Data) => void),
    selector = '[x-data]',
  ) {
    if (typeof key === 'string') key = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = Alpine.$data(this.$<ElementWithXAttributes>(selector)!);
    while (key.length > 1) data = data?.[key.shift()!];
    if (typeof value === 'function') value(data[key[0]]);
    else data[key[0]] = value;
    return Alpine.nextTick();
  },
};

export interface AlpineTestUtilities {
  Alpine: typeof Alpine;
  $: typeof document.querySelector;
  $$: typeof document.querySelectorAll;
  click: <El extends HTMLElement>(selector: string) => Promise<El>;
  type: <El extends HTMLInputElement | HTMLTextAreaElement>(
    selector: string,
    value: string,
  ) => Promise<El>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData: <Data extends Record<string | symbol, any>>(
    selector?: string,
  ) => Data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData: <Data extends Record<string | symbol, any>>(
    key: string | string[],
    value: unknown | ((data: Data) => void),
    selector?: string,
  ) => Promise<unknown>;
}

export default utilities;
