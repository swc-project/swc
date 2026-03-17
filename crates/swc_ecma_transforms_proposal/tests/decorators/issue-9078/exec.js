let addInitializer;

function dec(_, context) {
  throw ({ addInitializer } = context);
}

try {
  class A {
    @dec
    m() {}
  }
} catch (_) {}

expect(() => {
  addInitializer(() => {});
}).not.toThrow();
