export const waitFor = (node: string | Node) => {
  if (typeof node === 'string') node = document.querySelector(node)!;
  return new FutureNode(node);
};

class FutureNode {
  private node: Node;
  private text: string = '';
  constructor(node: Node) {
    this.node = node;
  }
  toHaveText(text: string) {
    this.text = text;
    return this;
  }
  public waitFor() {
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
      new Promise((resolve) =>
        setTimeout(() => {
          resolve(this.node);
        }, 1000),
      ),
    ]);
  }
  async then(cb: (el: Node) => void) {
    const node = await this.waitFor();
    cb(node);
    return expect(node.textContent).toBe(this.text);
  }
}
