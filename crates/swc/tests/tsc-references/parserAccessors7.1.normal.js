//// [parserAccessors7.ts]
//! 
//!   x A `get` accessor cannot have parameters
//!    ,----
//!  1 | var v = { get foo(v: number) { } };
//!    :               ^^^
//!    `----
