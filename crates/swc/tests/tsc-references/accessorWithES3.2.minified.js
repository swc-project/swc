//// [accessorWithES3.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[3:1]
//!  3 | 
//!  4 | class C {
//!  5 |     get x() {
//!    :         ^
//!  6 |         return 1;
//!  7 |     }
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[9:1]
//!   9 | 
//!  10 | class D {
//!  11 |     set x(v) {
//!     :         ^
//!  12 |     }
//!  13 | }
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[14:1]
//!  14 | 
//!  15 | var x = {
//!  16 |     get a() { return 1 }
//!     :         ^
//!  17 | }
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[18:1]
//!  18 | 
//!  19 | var y = {
//!  20 |     set b(v) { }
//!     :         ^
//!  21 | }
//!     `----
