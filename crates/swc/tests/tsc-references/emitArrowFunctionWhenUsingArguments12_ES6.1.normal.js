//// [emitArrowFunctionWhenUsingArguments12_ES6.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[1:1]
//!  1 | 
//!  2 | class C {
//!  3 |     f(arguments) {
//!    :       ^^^^^^^^^
//!  4 |         var a = () => arguments;
//!  5 |     }
//!    `----
