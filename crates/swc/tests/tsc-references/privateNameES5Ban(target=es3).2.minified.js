//// [privateNameES5Ban.ts]
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  8 | get #acc() { return ""; }
//!    :     ^^^^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!    ,----
//!  9 | set #acc(x: string) {}
//!    :     ^^^^
//!    `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  10 | static get #sAcc() { return 0; }
//!     :            ^^^^^
//!     `----
//! 
//!   x jsc.target should be es5 or upper to use getter / setter
//!     ,----
//!  11 | static set #sAcc(x: number) {}
//!     :            ^^^^^
//!     `----
