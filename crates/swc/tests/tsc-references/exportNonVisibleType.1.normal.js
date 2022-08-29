//// [foo1.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  7 | export = x; // Should fail, I1 not exported.
//!    : ^^^^^^^^^^^
//!    `----
//// [foo2.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,----
//!  10 | export = C1; // Should fail, type I1 of visible member C1.m1 not exported.
//!     : ^^^^^^^^^^^^
//!     `----
//// [foo3.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!     ,----
//!  10 | export = C1; // Should work, private type I1 of visible class C1 only used in private member m1.
//!     : ^^^^^^^^^^^^
//!     `----
