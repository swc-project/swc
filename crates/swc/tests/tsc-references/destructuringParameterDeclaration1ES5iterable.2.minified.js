//// [destructuringParameterDeclaration1ES5iterable.ts]
//! 
//!   x the name `d0` is defined multiple times
//!     ,-[60:1]
//!  60 | // or by including an initializer.
//!  61 | 
//!  62 | function d0(x?) { }
//!     :          ^|
//!     :           `-- previous definition of `d0` here
//!  63 | function d0(x = 10) { }
//!     :          ^|
//!     :           `-- `d0` redefined here
//!  64 | 
//!  65 | interface F2 {
//!     `----
