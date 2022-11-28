//// [emitArrowFunctionWhenUsingArguments14.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[2:1]
//!  2 | function f() {
//!  3 |     if (Math.random()) {
//!  4 |         const arguments = 100;
//!    :               ^^^^^^^^^
//!  5 |         return () => arguments;
//!  6 |     }
//!    `----
