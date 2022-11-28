//// [privateNameConstructorReserved.ts]
//! 
//!   x Classes can't have a private field named '#constructor'.
//!    ,-[2:1]
//!  2 | class A {
//!  3 |     #constructor() {}      // Error: `#constructor` is a reserved word.
//!    :     ^^^^^^^^^^^^
//!  4 | }
//!    `----
