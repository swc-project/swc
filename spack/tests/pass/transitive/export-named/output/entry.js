const foo3 = 1;
const bar3 = 1;
const baz3 = 1;
const foo1 = foo3, bar1 = bar3, baz1 = baz3;
const foo2 = foo1, bar2 = bar1;
export { foo2 as foo, bar2 as bar };
const baz2 = baz1;
export { baz2 as baz };
