//// [emitArrowFunctionWhenUsingArguments17_ES6.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[5:1]
//!  5 |         return () => arguments[0];
//!  6 |     }
//!  7 |     var arguments = "world";
//!    :         ^^^^^^^^^
//!  8 | }
//!    `----
