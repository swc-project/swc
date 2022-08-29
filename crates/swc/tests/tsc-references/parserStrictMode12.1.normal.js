//// [parserStrictMode12.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,----
//!  2 | var v = { set foo(eval) { } }
//!    :                   ^^^^
//!    `----
