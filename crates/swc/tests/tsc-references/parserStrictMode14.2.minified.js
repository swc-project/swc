//// [parserStrictMode14.ts]
//! 
//!   x The 'with' statement is not supported. All symbols in a 'with' block will have type 'any'.
//!    ,-[1:1]
//!  1 | "use strict";
//!  2 | with (a) {
//!    : ^^^^
//!  3 | }
//!    `----
//! 
//!   x With statement are not allowed in strict mode
//!    ,-[1:1]
//!  1 | "use strict";
//!  2 | with (a) {
//!    : ^^^^
//!  3 | }
//!    `----
