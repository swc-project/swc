//// [classAbstractMethodInNonAbstractClass.ts]
//! 
//!   x Abstract methods can only appear within an abstract class.
//!    ,----
//!  2 | abstract foo();
//!    : ^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Abstract method cannot have an implementation.
//!    ,----
//!  6 | abstract foo() {}
//!    : ^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Abstract methods can only appear within an abstract class.
//!    ,----
//!  6 | abstract foo() {}
//!    : ^^^^^^^^^^^^^^^^^
//!    `----
