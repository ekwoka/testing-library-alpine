/* eslint-disable no-var */
import Alpine from 'alpinejs';

import { render as renderFunc } from './render';
import { utilities as utils } from './utilities';
import { waitFor as waitForFunc } from './waitFor';

type AlpineType = typeof Alpine;
beforeAll(() => Alpine.start());

afterEach(() => {
  document.body.innerHTML = '';
});

const innerData = Alpine.data;

Alpine.data = (name, component) => {
  const wrappedComponent = (
    ...args: Parameters<typeof component>
  ): ReturnType<typeof component> => {
    const data = component(...args);
    for (const key in data)
      if (typeof data[key] === 'function')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data[key as keyof typeof data] = vi.fn(data[key] as any) as any;
    return data;
  };
  return innerData(name, wrappedComponent);
};

Object.assign(globalThis, {
  Alpine,
  render: renderFunc,
  waitFor: waitForFunc,
  ...utils,
});

declare global {
  var render: typeof renderFunc;
  var waitFor: typeof waitForFunc;
  var Alpine: AlpineType;
  var $: typeof utils.$;
  var $$: typeof utils.$$;
  var click: typeof utils.click;
  var type: typeof utils.type;
  var getData: typeof utils.getData;
  var setData: typeof utils.setData;
  var expectData: typeof utils.expectData;
}
