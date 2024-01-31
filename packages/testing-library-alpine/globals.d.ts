import type { Alpine as IAlpine } from 'alpinejs';

declare global {
  const render: typeof import('@ekwoka/alpine-testing-library-utilities').render;
  const waitFor: typeof import('@ekwoka/alpine-testing-library-utilities').waitFor;
  const Alpine: IAlpine;
  const $: typeof import('@ekwoka/alpine-testing-library-utilities').$;
  const $$: typeof import('@ekwoka/alpine-testing-library-utilities').$$;
  const click: typeof import('@ekwoka/alpine-testing-library-utilities').click;
  const type: typeof import('@ekwoka/alpine-testing-library-utilities').type;
  const getData: typeof import('@ekwoka/alpine-testing-library-utilities').getData;
  const setData: typeof import('@ekwoka/alpine-testing-library-utilities').setData;
  const expectData: typeof import('@ekwoka/alpine-testing-library-utilities').expectData;
}
export {};
