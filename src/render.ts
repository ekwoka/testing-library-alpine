export const render = (html: string) => new Render(html);

class Render {
  private html: string;
  constructor(html: string) {
    this.html = html;
  }
  public render() {
    document.body.innerHTML = this.html;
  }
  then(cb: (el: Node) => void) {
    this.render();
    cb(document.body.firstChild!);
    return document.body.firstChild!;
  }
}
