export const waitFor = (node: string | Node) => {
  if (typeof node === 'string') node = document.querySelector(node)!;
  return new FutureNode(node);
};

class FutureNode {
  private node: Node;
  private text: string = '';
  private timeout: number = 1000;
  constructor(node: Node) {
    this.node = node;
  }
  withTimeout(timeout: number) {
    this.timeout = timeout;
    return this;
  }
  toHaveText(text: string) {
    this.text = text;
    return this;
  }
  waitFor() {
    if (this.node.textContent === this.text) return Promise.resolve(this.node);
    return Promise.race([
      new Promise<Node>((resolve) => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) =>
            mutation.addedNodes.forEach((node) => {
              if (node.textContent !== this.text) return;
              resolve(node);
              observer.disconnect();
            }),
          );
        });
        observer.observe(this.node, {
          childList: true,
        });
      }),
      new Promise<Node>((resolve) =>
        setTimeout(() => {
          resolve(this.node);
        }, this.timeout),
      ),
    ]);
  }
  async then(cb: (el: Node) => void) {
    const node = await this.waitFor();
    cb(node);
    return expect(node.textContent).toBe(this.text);
  }
}

if (import.meta.vitest) {
  describe('waitFor', () => {
    it('waits for text content', async () => {
      document.body.innerHTML = '<div>Hello</div>';
      const div = document.querySelector('div')!;
      setTimeout(() => {
        div.textContent = 'World';
      }, 100);
      await waitFor(div).toHaveText('World');
    });
    it.fails.skip('can timeout', async () => {
      document.body.innerHTML = '<div>Hello</div>';
      const div = document.querySelector('div')!;
      setTimeout(() => {
        div.textContent = 'World';
      }, 1000);
      await waitFor(div).toHaveText('World').withTimeout(100);
    });
  });
}
