//// [parserErrantSemicolonInClass1.ts]
//! 
//!   x A `set` accessor must have exactly one parameter
//!     ,-[12:5]
//!  12 | public get d() {
//!  13 |         return 30;
//!  14 |     }
//!  15 |     public set d() {
//!     :            ^^^
//!  16 |     }
//!  17 | 
//!  18 |     public static get p2() {
//!     `----
