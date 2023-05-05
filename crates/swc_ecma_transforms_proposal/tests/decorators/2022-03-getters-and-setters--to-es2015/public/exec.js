function dec(value, context) {
  context.addInitializer(function() {
    this[context.name + '_' + context.kind + 'Context'] = context;
  });

  if (context.kind === 'getter') {
    return function () {
      return value.call(this) + 1;
    }
  } else {
    return function (v) {
      return value.call(this, v + 1);
    }
  }
}

class Foo {
  value = 1;

  @dec
  get a() {
    return this.value;
  }

  @dec
  set a(v) {
    this.value = v;
  }

  @dec
  get ['b']() {
    return this.value;
  }

  @dec
  set ['b'](v) {
    this.value = v;
  }
}

let foo = new Foo();

const a_getterContext = foo['a_getterContext'];
const a_setterContext = foo['a_setterContext'];

const b_getterContext = foo['b_getterContext'];
const b_setterContext = foo['b_setterContext'];

expect(foo.a).toBe(2);
expect(foo.b).toBe(2);
expect(a_getterContext.access.get.call(foo)).toBe(2);
expect(b_getterContext.access.get.call(foo)).toBe(2);
foo.a = 123;
expect(foo.a).toBe(125);
expect(foo.b).toBe(125);
expect(a_getterContext.access.get.call(foo)).toBe(125);
expect(b_getterContext.access.get.call(foo)).toBe(125);
foo.b = 456;
expect(foo.a).toBe(458);
expect(foo.b).toBe(458);
expect(a_getterContext.access.get.call(foo)).toBe(458);
expect(b_getterContext.access.get.call(foo)).toBe(458);
a_setterContext.access.set.call(foo, 789);
expect(foo.a).toBe(791);
expect(foo.b).toBe(791);
expect(a_getterContext.access.get.call(foo)).toBe(791);
expect(b_getterContext.access.get.call(foo)).toBe(791);

expect(a_getterContext.name).toBe('a');
expect(a_getterContext.kind).toBe('getter');
expect(a_getterContext.static).toBe(false);
expect(a_getterContext.private).toBe(false);
expect(typeof a_getterContext.addInitializer).toBe('function');

expect(a_setterContext.name).toBe('a');
expect(a_setterContext.kind).toBe('setter');
expect(a_setterContext.static).toBe(false);
expect(a_setterContext.private).toBe(false);
expect(typeof a_setterContext.addInitializer).toBe('function');

expect(b_getterContext.name).toBe('b');
expect(b_getterContext.kind).toBe('getter');
expect(b_getterContext.static).toBe(false);
expect(b_getterContext.private).toBe(false);
expect(typeof b_getterContext.addInitializer).toBe('function');

expect(b_setterContext.name).toBe('b');
expect(b_setterContext.kind).toBe('setter');
expect(b_setterContext.static).toBe(false);
expect(b_setterContext.private).toBe(false);
expect(typeof b_setterContext.addInitializer).toBe('function');
