//// [privateNamesUnique-3.ts]
//! 
//!   x duplicate private name #foo.
//!    ,----
//!  4 | static #foo = true; // error (duplicate)
//!    :         ^^^
//!    `----
