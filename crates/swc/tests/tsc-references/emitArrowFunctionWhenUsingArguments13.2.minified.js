//// [emitArrowFunctionWhenUsingArguments13.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  4 | var a = (arguments) => () => _arguments;
//!    :          ^^^^^^^^^
//!    `----
