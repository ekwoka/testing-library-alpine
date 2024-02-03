import { test as vitest } from 'vitest';
import type { TestAPI } from 'vitest';

export const test: TestAPI<unknown> = vitest.extend({});
export const it = test;
