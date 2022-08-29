//// [emitArrowFunctionWhenUsingArguments16.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  3 | var arguments = "hello";
//!    :     ^^^^^^^^^
//!    `----
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  7 | var arguments = "world";
//!    :     ^^^^^^^^^
//!    `----
