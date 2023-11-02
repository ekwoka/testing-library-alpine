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
});
