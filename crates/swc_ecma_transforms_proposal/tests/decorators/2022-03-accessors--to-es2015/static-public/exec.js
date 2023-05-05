function dec({ get, set }, context) {
  context.addInitializer(function() {
    this[context.name + 'Context'] = context;
  });

  return {
    get() {
      return get.call(this) + 1;
    },

    set(v) {
      set.call(this, v + 1);
    },

    init(v) {
      return v ? v : 1;
    }
  }
}

class Foo {
  @dec
  static accessor a;

  @dec
  static accessor b = 123;

  @dec
  static accessor ['c'] = 456;
}

const aContext = Foo['aContext'];
const bContext = Foo['bContext'];
const cContext = Foo['cContext'];

expect(Foo.a).toBe(2);
expect(aContext.access.get.call(Foo)).toBe(2);
Foo.a = 123;
expect(Foo.a).toBe(125);
expect(aContext.access.get.call(Foo)).toBe(125);
aContext.access.set.call(Foo, 456);
expect(Foo.a).toBe(458);
expect(aContext.access.get.call(Foo)).toBe(458);
expect(aContext.name).toBe('a');
expect(aContext.kind).toBe('accessor');
expect(aContext.static).toBe(true);
expect(aContext.private).toBe(false);
expect(typeof aContext.addInitializer).toBe('function');
expect(Foo.hasOwnProperty('a')).toBe(true);

expect(Foo.b).toBe(124);
Foo.b = 123;
expect(Foo.b).toBe(125);
expect(bContext.name).toBe('b');
expect(bContext.kind).toBe('accessor');
expect(bContext.static).toBe(true);
expect(bContext.private).toBe(false);
expect(typeof bContext.addInitializer).toBe('function');
expect(Foo.hasOwnProperty('b')).toBe(true);

expect(Foo.c).toBe(457);
Foo.c = 456;
expect(Foo.c).toBe(458);
expect(cContext.name).toBe('c');
expect(cContext.kind).toBe('accessor');
expect(cContext.static).toBe(true);
expect(cContext.private).toBe(false);
expect(typeof cContext.addInitializer).toBe('function');
expect(Foo.hasOwnProperty('c')).toBe(true);
