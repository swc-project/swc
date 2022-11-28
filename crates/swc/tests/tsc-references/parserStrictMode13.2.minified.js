//// [parserStrictMode13.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[2:1]
//!  2 | try {
//!  3 | }
//!  4 | catch(eval) {
//!    :       ^^^^
//!  5 | }
//!    `----
