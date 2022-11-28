//// [externs.d.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,-[12:1]
//!  12 |     const Foo: typeof MyClass;
//!  13 | }
//!  14 | export = MyClass;
//!     : ^^^^^^^^^^^^^^^^^
//!     `----
//// [index.js]
new Foo({
    doer: Foo.Bar
});
