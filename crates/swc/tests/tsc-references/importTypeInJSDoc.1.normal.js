//// [externs.d.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,-[14:1]
//!  11 | declare global {
//!  12 |     const Foo: typeof MyClass;
//!  13 | }
//!  14 | export = MyClass;
//!     : ^^^^^^^^^^^^^^^^^
//!     `----
//// [index.js]
/**
 * @typedef {import("./externs")} Foo
 */ let a = /** @type {*} */ undefined;
a = new Foo({
    doer: Foo.Bar
});
const q = /** @type {import("./externs").Bar} */ {
    doer: (q)=>q
};
const r = /** @type {typeof import("./externs").Bar} */ (r)=>r;
