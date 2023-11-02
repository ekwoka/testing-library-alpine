export const render = (html: string) => new Render(html);

class Render {
  private html: string;
  constructor(html: string) {
    this.html = html;
  }
  render() {
    document.body.innerHTML = this.html;
  }
  then(cb: (el: Node) => void) {
    this.render();
    cb(document.body.firstChild!);
    return document.body.firstChild!;
  }
}

if (import.meta.vitest) {
  describe('Render', () => {
    it('renders', () => {
      render('<div>Hello</div>').then((el) => {
        expect(el.textContent).toBe('Hello');
      });
    });
    it('can be awaited', async () => {
      await render('<div>World</div>');
      expect(document.querySelector('div')!.textContent).toBe('World');
    });
  });
}
