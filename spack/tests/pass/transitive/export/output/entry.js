const foo = 1;
const bar = 1;
const baz = 1;
const foo1 = foo, bar1 = bar, baz1 = baz;
const foo2 = foo1, bar2 = bar1;
export { foo2 as foo, bar2 as bar };
const baz2 = baz1;
export { baz2 as baz };
