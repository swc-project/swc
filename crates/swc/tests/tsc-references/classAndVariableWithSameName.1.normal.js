//// [classAndVariableWithSameName.ts]
//!   x the name `C` is defined multiple times
//!    ,-[1:1]
//!  1 | class C { foo: string; } // error
//!    :       |
//!    :       `-- previous definition of `C` here
//!  2 | var C = ''; // error
//!    :     |
//!    :     `-- `C` redefined here
//!  3 | 
//!  4 | module M {
//!  5 |     class D { // error
//!    `----
//!   x the name `D` is defined multiple times
//!     ,-[5:1]
//!   2 | var C = ''; // error
//!   3 | 
//!   4 | module M {
//!   5 |     class D { // error
//!     :           |
//!     :           `-- previous definition of `D` here
//!   6 |         bar: string;
//!   7 |     }
//!   8 | 
//!   9 |     var D = 1; // error
//!     :         |
//!     :         `-- `D` redefined here
//!  10 | }
//!     `----
