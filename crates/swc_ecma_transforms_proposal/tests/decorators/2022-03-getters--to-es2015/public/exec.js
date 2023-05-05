function dec(get, context) {
  context.addInitializer(function() {
    this[context.name + 'Context'] = context;
  });

  return function () {
    return get.call(this) + 1;
  }
}

class Foo {
  value = 1;

  @dec
  get a() {
    return this.value;
  }

  @dec
  get ['b']() {
    return this.value;
  }
}

let foo = new Foo();

const aContext = foo['aContext'];
const bContext = foo['bContext'];

expect(foo.a).toBe(2);
expect(foo.b).toBe(2);
expect(aContext.access.get.call(foo)).toBe(2);
expect(bContext.access.get.call(foo)).toBe(2);
foo.value = 123;
expect(foo.a).toBe(124);
expect(foo.b).toBe(124);
expect(aContext.access.get.call(foo)).toBe(124);
expect(bContext.access.get.call(foo)).toBe(124);

expect(aContext.name).toBe('a');
expect(aContext.kind).toBe('getter');
expect(aContext.static).toBe(false);
expect(aContext.private).toBe(false);
expect(typeof aContext.addInitializer).toBe('function');

expect(bContext.name).toBe('b');
expect(bContext.kind).toBe('getter');
expect(bContext.static).toBe(false);
expect(bContext.private).toBe(false);
expect(typeof bContext.addInitializer).toBe('function');
