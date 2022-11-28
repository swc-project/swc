//// [parser10.1.1-8gs.ts]
//! 
//!   x `public` cannot be used as an identifier in strict mode
//!     ,-[16:1]
//!  16 | "use strict";
//!  17 | throw NotEarlyError;
//!  18 | var public = 1;
//!     :     ^^^^^^
//!     `----
