function dec(set, context) {
  context.addInitializer(function() {
    this[context.name + 'Context'] = context;
  });

  expect(set.name).toEqual("set " + context.name);
  return function (v) {
    return set.call(this, v + 1);
  }
}

class Foo {
  value = 1;

  @dec
  set a(v) {
    return this.value = v;
  }

  @dec
  set ['b'](v) {
    return this.value = v;
  }
}

let foo = new Foo();

const aContext = foo['aContext'];
const bContext = foo['bContext'];

expect(aContext.access).not.toHaveProperty("get");
expect(bContext.access).not.toHaveProperty("get");

expect(aContext.access.has(foo)).toBe(true);
expect(aContext.access.has({})).toBe(false);
expect(aContext.access.has(Object.create(foo))).toBe(true);
expect(aContext.access.has({ a: 1 })).toBe(true);
expect(aContext.access.has(Object.create({ a: 1 }))).toBe(true);

expect(foo.value).toBe(1);
foo.a = 123;
expect(foo.value).toBe(124);
aContext.access.set(foo, 456);
expect(foo.value).toBe(457);

expect(aContext.name).toBe('a');
expect(aContext.kind).toBe('setter');
expect(aContext.static).toBe(false);
expect(aContext.private).toBe(false);
expect(typeof aContext.addInitializer).toBe('function');

expect(bContext.name).toBe('b');
expect(bContext.kind).toBe('setter');
expect(bContext.static).toBe(false);
expect(bContext.private).toBe(false);
expect(typeof bContext.addInitializer).toBe('function');
