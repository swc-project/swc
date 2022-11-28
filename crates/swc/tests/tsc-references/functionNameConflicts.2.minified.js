//// [functionNameConflicts.ts]
//! 
//!   x the name `fn1` is defined multiple times
//!    ,-[3:1]
//!  3 | 
//!  4 | module M {
//!  5 |     function fn1() { }
//!    :              ^|^
//!    :               `-- previous definition of `fn1` here
//!  6 |     var fn1;
//!    :         ^|^
//!    :          `-- `fn1` redefined here
//!  7 | 
//!  8 |     var fn2;
//!    `----
//! 
//!   x the name `fn2` is defined multiple times
//!     ,-[6:1]
//!   6 |     var fn1;
//!   7 | 
//!   8 |     var fn2;
//!     :         ^|^
//!     :          `-- previous definition of `fn2` here
//!   9 |     function fn2() { }
//!     :              ^|^
//!     :               `-- `fn2` redefined here
//!  10 | }
//!     `----
//! 
//!   x the name `fn3` is defined multiple times
//!     ,-[10:1]
//!  10 | }
//!  11 | 
//!  12 | function fn3() { }
//!     :          ^|^
//!     :           `-- previous definition of `fn3` here
//!  13 | var fn3;
//!     :     ^|^
//!     :      `-- `fn3` redefined here
//!  14 | 
//!  15 | function func() {
//!     `----
