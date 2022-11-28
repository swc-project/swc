//// [computedPropertyNames49_ES6.ts]
//! 
//!   x A `set` accessor must have exactly one parameter
//!     ,-[7:1]
//!   7 |     get [1 + 1]() {
//!   8 |         return 10;
//!   9 |     },
//!  10 |     set [1 + 1]() {
//!     :         ^^^^^^^
//!  11 |         // just throw
//!  12 |         throw 10;
//!  13 |     },
//!     `----
