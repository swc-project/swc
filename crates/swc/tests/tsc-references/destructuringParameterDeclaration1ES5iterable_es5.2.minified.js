//!
//!  x the name `d0` is defined multiple times
//!    ,-[63:1]
//! 63 | function d0(x?) { }
//!    :          ^|
//!    :           `-- previous definition of `d0` here
//! 64 | function d0(x = 10) { }
//!    :          ^|
//!    :           `-- `d0` redefined here
//!    `----
