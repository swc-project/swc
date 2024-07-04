//// [emitArrowFunctionWhenUsingArguments16_ES6.ts]
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[3:1]
//!  1 | 
//!  2 | function f() {
//!  3 |     var arguments = "hello";
//!    :         ^^^^^^^^^
//!  4 |     if (Math.random()) {
//!  5 |         return () => arguments[0];
//!  6 |     }
//!    `----
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[7:1]
//!  4 |     if (Math.random()) {
//!  5 |         return () => arguments[0];
//!  6 |     }
//!  7 |     var arguments = "world";
//!    :         ^^^^^^^^^
//!  8 | }
//!    `----
