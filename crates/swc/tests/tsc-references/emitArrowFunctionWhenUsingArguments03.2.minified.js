//// [emitArrowFunctionWhenUsingArguments03.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[1:1]
//!  1 | 
//!  2 | var arguments;
//!    :     ^^^^^^^^^
//!  3 | var a = () => arguments;
//!    `----
