import type { PluginCallback } from 'alpinejs';

export const spyOnAlpine: PluginCallback = (Alpine) => {
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
};
