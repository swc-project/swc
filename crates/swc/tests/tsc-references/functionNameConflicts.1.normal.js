//// [functionNameConflicts.ts]
//!   x the name `fn1` is defined multiple times
//!    ,-[5:1]
//!  2 | //Function overload with different name from implementation signature 
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
//!  9 |     function fn2() { }
//!    `----
//!   x the name `fn2` is defined multiple times
//!     ,-[8:1]
//!   5 |     function fn1() { }
//!   6 |     var fn1;
//!   7 | 
//!   8 |     var fn2;
//!     :         ^|^
//!     :          `-- previous definition of `fn2` here
//!   9 |     function fn2() { }
//!     :              ^|^
//!     :               `-- `fn2` redefined here
//!  10 | }
//!  11 | 
//!  12 | function fn3() { }
//!     `----
//!   x the name `fn3` is defined multiple times
//!     ,-[12:1]
//!   9 |     function fn2() { }
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
//!  16 |     var fn4;
//!     `----
