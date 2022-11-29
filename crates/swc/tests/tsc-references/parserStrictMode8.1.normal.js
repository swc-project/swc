//// [parserStrictMode8.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!    ,-[1:1]
//!  1 | "use strict";
//!  2 | function eval() {
//!    :          ^^^^
//!  3 | }
//!    `----
