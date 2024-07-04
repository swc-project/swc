//// [emitArrowFunctionWhenUsingArguments11.ts]
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[2:1]
//!  1 | 
//!  2 | function f(arguments) {
//!    :            ^^^^^^^^^
//!  3 |     var _arguments = 10;
//!  4 |     var a = () => () => arguments;
//!  5 | }
//!    `----
