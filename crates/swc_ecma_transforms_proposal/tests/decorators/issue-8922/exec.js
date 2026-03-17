function dec(value) {
  return value;
}

class Foo {
  accessor foo;
  static accessor foo;
}

const foo = new Foo();
foo.foo = 123;
Foo.foo = 456;
expect(foo.foo).toBe(123);
expect(Foo.foo).toBe(456);

async function createBar() {
  @dec
  class Bar extends (await Promise.resolve(class {})) {
    @dec
    static field = 1;
  }

  expect(Bar.field).toBe(1);
}

createBar();

class Baz {
  accessor foo = @dec class {};
}

expect(typeof new Baz().foo).toBe("function");
