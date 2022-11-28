//// [emitArrowFunctionWhenUsingArguments07.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[1:1]
//!  1 | 
//!  2 | function f(arguments) {
//!    :            ^^^^^^^^^
//!  3 |     var a = (arguments) => () => arguments;
//!  4 | }
//!    `----
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[1:1]
//!  1 | 
//!  2 | function f(arguments) {
//!  3 |     var a = (arguments) => () => arguments;
//!    :              ^^^^^^^^^
//!  4 | }
//!    `----
