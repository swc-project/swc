//// [classAbstractUsingAbstractMethods2.ts]
//! 
//!   x Abstract methods can only appear within an abstract class.
//!    ,-[1:1]
//!  1 | class A {
//!  2 |     abstract foo();
//!    :     ^^^^^^^^^^^^^^^
//!  3 | }
//!  4 | 
//!  5 | class B extends A  {}
//!    `----
