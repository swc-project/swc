function dec(_v, context) {
  return function (v) {
    this[context.name + 'Context'] = context;
    return (v || 1) + 1;
  }
}

class Foo {
  @dec
  #a;

  @dec
  #b = 123;
}

let foo = new Foo();

const aContext = foo['#aContext'];
const bContext = foo['#bContext'];

expect(aContext.access.get.call(foo)).toBe(2);
aContext.access.set.call(foo, 123);
expect(aContext.access.get.call(foo)).toBe(123);
expect(aContext.name).toBe('#a');
expect(aContext.kind).toBe('field');
expect(aContext.static).toBe(false);
expect(aContext.private).toBe(true);
expect(typeof aContext.addInitializer).toBe('function');

expect(bContext.access.get.call(foo)).toBe(124);
bContext.access.set.call(foo, 123);
expect(bContext.access.get.call(foo)).toBe(123);
expect(bContext.name).toBe('#b');
expect(bContext.kind).toBe('field');
expect(bContext.static).toBe(false);
expect(bContext.private).toBe(true);
expect(typeof aContext.addInitializer).toBe('function');
