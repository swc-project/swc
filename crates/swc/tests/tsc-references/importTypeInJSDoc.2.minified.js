//// [externs.d.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,----
//!  14 | export = MyClass;
//!     : ^^^^^^^^^^^^^^^^^
//!     `----
//// [index.js]
let a;
a = new Foo({
    doer: Foo.Bar
});
const q = {
    doer: (q)=>q
}, r = (r)=>r;
