//// [emitArrowFunctionWhenUsingArguments08.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  2 | function f(arguments) {
//!    :            ^^^^^^^^^
//!    `----
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  3 | var a = () => (arguments) => arguments;
//!    :                ^^^^^^^^^
//!    `----
