//// [accessorWithES3.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,-[2:1]
//!  2 | // error to use accessors in ES3 mode
//!  3 | 
//!  4 | class C {
//!  5 |     get x() {
//!    :         ^
//!  6 |         return 1;
//!  7 |     }
//!  8 | }
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[8:1]
//!   8 | }
//!   9 | 
//!  10 | class D {
//!  11 |     set x(v) {
//!     :         ^
//!  12 |     }
//!  13 | }
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[13:1]
//!  13 | }
//!  14 | 
//!  15 | var x = {
//!  16 |     get a() { return 1 }
//!     :         ^
//!  17 | }
//!  18 | 
//!  19 | var y = {
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,-[17:1]
//!  17 | }
//!  18 | 
//!  19 | var y = {
//!  20 |     set b(v) { }
//!     :         ^
//!  21 | }
//!     `----
