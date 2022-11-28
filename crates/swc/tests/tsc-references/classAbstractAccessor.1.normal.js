//// [classAbstractAccessor.ts]
//! 
//!   x Abstract method cannot have an implementation.
//!    ,-[2:1]
//!  2 | abstract class A {
//!  3 |    abstract get a();
//!  4 |    abstract get aa() { return 1; } // error
//!    :    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  5 |    abstract set b(x: string);
//!  6 |    abstract set bb(x: string) {} // error
//!    `----
//! 
//!   x Abstract method cannot have an implementation.
//!    ,-[4:1]
//!  4 |    abstract get aa() { return 1; } // error
//!  5 |    abstract set b(x: string);
//!  6 |    abstract set bb(x: string) {} // error
//!    :    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  7 | }
//!    `----
