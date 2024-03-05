Object.assign({}, foo);

Object.assign({}, { foo: 'bar' });

Object.assign({}, baz, { foo: 'bar' });

Object.assign({}, { foo: 'bar', baz: 'foo' });

Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }, baz))

Object.assign({});

Object['assign']({});

Object[`assign`]({});

// Valid

Object.assign(foo, { bar: baz });
Object.assign();
let a = Object.assign(a, b);
Object.assign(...foo);
Object.assign(foo, { bar: baz });
Object.assign({}, ...objects);
() => {
  const Object = {};
  Object.assign({}, foo);
};
Object.assign({ get a() {} }, {});
Object.assign({ set a(val) {} }, {});
Object.assign({ get a() {} }, foo);
Object.assign({ set a(val) {} }, foo);
Object.assign({ foo: 'bar', get a() {}, baz: 'quux' }, quuux);
Object.assign({ foo: 'bar', set a(val) {} }, { baz: 'quux' });
Object.assign({}, { get a() {} });
Object.assign({}, { set a(val) {} });
Object.assign({}, { foo: 'bar', get a() {} }, {});
Object.assign({ foo }, bar, {}, { baz: 'quux', set a(val) {}, quuux }, {});
