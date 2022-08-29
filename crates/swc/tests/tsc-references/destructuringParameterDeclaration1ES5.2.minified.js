//// [destructuringParameterDeclaration1ES5.ts]
//! 
//!   x the name `d0` is defined multiple times
//!     ,-[62:1]
//!  62 | function d0(x?) { }
//!     :          ^|
//!     :           `-- previous definition of `d0` here
//!  63 | function d0(x = 10) { }
//!     :          ^|
//!     :           `-- `d0` redefined here
//!     `----
