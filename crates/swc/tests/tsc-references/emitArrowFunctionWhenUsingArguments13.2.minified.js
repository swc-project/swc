//// [emitArrowFunctionWhenUsingArguments13.ts]
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[4:1]
//!  1 | 
//!  2 | function f() {
//!  3 |     var _arguments = 10;
//!  4 |     var a = (arguments) => () => _arguments;
//!    :              ^^^^^^^^^
//!  5 | }
//!    `----
