//// [emitArrowFunctionWhenUsingArguments04_ES6.ts]
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[3:1]
//!  1 | 
//!  2 | function f() {
//!  3 |     var arguments;
//!    :         ^^^^^^^^^
//!  4 |     var a = () => arguments;
//!  5 | }
//!    `----
