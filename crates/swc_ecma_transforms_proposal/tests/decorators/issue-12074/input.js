const fields = Symbol.for("fields");
const track = () => (_value, ctx) => {
  if (ctx.kind === "field") {
    ctx.addInitializer(function () {
      (this[fields] ??= new Set()).add(ctx.name);
    });
  }
};

class Foo {
  @track() a;
  @track() b;
  static X = class {}; // <-- remove this line and the decorators run
  constructor() {
    this.a = 1;
    this.b = 2;
  }
}

console.log([...(new Foo()[fields] ?? [])]); // expected ["a","b"], actual []
