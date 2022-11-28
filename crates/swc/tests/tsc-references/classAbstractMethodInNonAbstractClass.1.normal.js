//// [classAbstractMethodInNonAbstractClass.ts]
//! 
//!   x Abstract methods can only appear within an abstract class.
//!    ,-[1:1]
//!  1 | class A {
//!  2 |     abstract foo();
//!    :     ^^^^^^^^^^^^^^^
//!  3 | }
//!  4 | 
//!  5 | class B {
//!    `----
//! 
//!   x Abstract method cannot have an implementation.
//!    ,-[3:1]
//!  3 | }
//!  4 | 
//!  5 | class B {
//!  6 |     abstract foo() {}
//!    :     ^^^^^^^^^^^^^^^^^
//!  7 | }
//!    `----
//! 
//!   x Abstract methods can only appear within an abstract class.
//!    ,-[3:1]
//!  3 | }
//!  4 | 
//!  5 | class B {
//!  6 |     abstract foo() {}
//!    :     ^^^^^^^^^^^^^^^^^
//!  7 | }
//!    `----
