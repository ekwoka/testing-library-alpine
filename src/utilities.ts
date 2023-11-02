import Alpine, { ElementWithXAttributes } from 'alpinejs';

export const utilities = {
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
  getData(selector = '[x-data]', key?: string | symbol) {
    const data = Alpine.$data(
      this.$<ElementWithXAttributes>(selector)!,
    ) as Record<string | symbol, unknown>;
    if (key) return data[key];
    return data;
  },
  setData(
    key: string | string[],
    value: unknown | ((data: unknown) => void),
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

export default utilities;
