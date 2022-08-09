//!
//!  x the name `fn1` is defined multiple times
//!   ,-[5:5]
//! 5 | function fn1() { }
//!   :          ^|^
//!   :           `-- previous definition of `fn1` here
//! 6 |     var fn1;
//!   :         ^|^
//!   :          `-- `fn1` redefined here
//!   `----
//!
//!  x the name `fn2` is defined multiple times
//!   ,-[8:5]
//! 8 | var fn2;
//!   :     ^|^
//!   :      `-- previous definition of `fn2` here
//! 9 |     function fn2() { }
//!   :              ^|^
//!   :               `-- `fn2` redefined here
//!   `----
//!
//!  x the name `fn3` is defined multiple times
//!    ,-[12:1]
//! 12 | function fn3() { }
//!    :          ^|^
//!    :           `-- previous definition of `fn3` here
//! 13 | var fn3;
//!    :     ^|^
//!    :      `-- `fn3` redefined here
//!    `----
