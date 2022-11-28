//// [privateNamesUnique-3.ts]
//! 
//!   x duplicate private name #foo.
//!    ,-[2:1]
//!  2 | class A {
//!  3 |     #foo = 1;
//!  4 |     static #foo = true; // error (duplicate)
//!    :             ^^^
//!  5 |                         // because static and instance private names
//!  6 |                         // share the same lexical scope
//!    `----
