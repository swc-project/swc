//// [foo1.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[7:1]
//!  4 | }
//!  5 | 
//!  6 | var x: I1 = {a: "test", b: 42};
//!  7 | export = x; // Should fail, I1 not exported.
//!    : ^^^^^^^^^^^
//!  8 | 
//!  9 | 
//!    `----
//// [foo2.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,-[10:1]
//!   7 |     m1: I1;
//!   8 | }
//!   9 | 
//!  10 | export = C1; // Should fail, type I1 of visible member C1.m1 not exported.
//!     : ^^^^^^^^^^^^
//!  11 | 
//!     `----
//// [foo3.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,-[10:1]
//!   7 |     private m1: I1;
//!   8 | }
//!   9 | 
//!  10 | export = C1; // Should work, private type I1 of visible class C1 only used in private member m1.
//!     : ^^^^^^^^^^^^
//!     `----
