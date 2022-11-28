//// [accessorsOverrideProperty7.ts]
//! 
//!   x Abstract property cannot have an initializer.
//!    ,-[1:1]
//!  1 | abstract class A {
//!  2 |     abstract p = 'yep'
//!    :     ^^^^^^^^^^^^^^^^^^
//!  3 | }
//!  4 | class B extends A {
//!    `----
