//// [accessorWithES3.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  5 | get x() {
//!    :     ^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  11 | set x(v) {
//!     :     ^
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  16 | get a() { return 1 }
//!     :     ^
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  20 | set b(v) { }
//!     :     ^
//!     `----
