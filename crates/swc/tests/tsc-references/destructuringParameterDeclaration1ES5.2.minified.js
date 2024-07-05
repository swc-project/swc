//// [destructuringParameterDeclaration1ES5.ts]
//!   x the name `d0` is defined multiple times
//!     ,-[62:1]
//!  59 | // A parameter can be marked optional by following its name or binding pattern with a question mark (?)
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
//!  66 |     d3([a, b, c]?);
//!     `----
