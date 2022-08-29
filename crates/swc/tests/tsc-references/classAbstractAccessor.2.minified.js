//// [classAbstractAccessor.ts]
//! 
//!   x Abstract method cannot have an implementation.
//!    ,----
//!  4 | abstract get aa() { return 1; } // error
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Abstract method cannot have an implementation.
//!    ,----
//!  6 | abstract set bb(x: string) {} // error
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
