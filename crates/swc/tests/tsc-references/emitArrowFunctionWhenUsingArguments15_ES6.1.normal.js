//// [emitArrowFunctionWhenUsingArguments15_ES6.ts]
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[3:1]
//!  1 | 
//!  2 | function f() {
//!  3 |     var arguments = "hello";
//!    :         ^^^^^^^^^
//!  4 |     if (Math.random()) {
//!  5 |         const arguments = 100;
//!  6 |         return () => arguments;
//!    `----
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[5:1]
//!  2 | function f() {
//!  3 |     var arguments = "hello";
//!  4 |     if (Math.random()) {
//!  5 |         const arguments = 100;
//!    :               ^^^^^^^^^
//!  6 |         return () => arguments;
//!  7 |     }
//!  8 | }
//!    `----
