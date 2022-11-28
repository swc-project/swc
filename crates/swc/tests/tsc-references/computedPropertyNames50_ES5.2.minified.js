//// [computedPropertyNames50_ES5.ts]
//! 
//!   x A `set` accessor must have exactly one parameter
//!     ,-[10:1]
//!  10 |         throw 10;
//!  11 |     },
//!  12 |     set [1 + 1]() {
//!     :         ^^^^^^^
//!  13 |         // just throw
//!  14 |         throw 10;
//!     `----
