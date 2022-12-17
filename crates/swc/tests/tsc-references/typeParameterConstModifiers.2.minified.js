//// [typeParameterConstModifiers.ts]
//! 
//!   x 'const' modifier can only appear on a type parameter of a function, method or class
//!     ,-[41:1]
//!  41 | const fx1 = <const T>(x: T) => x;
//!  42 | const fx2 = <const T,>(x: T) => x;
//!  43 | 
//!  44 | interface I1<const T> { x: T }  // Error
//!     :              ^^^^^
//!  45 | 
//!  46 | interface I2 {
//!  47 |     f<const T>(x: T): T;
//!     `----
//! 
//!   x 'const' modifier can only appear on a type parameter of a function, method or class
//!     ,-[47:1]
//!  47 |     f<const T>(x: T): T;
//!  48 | }
//!  49 | 
//!  50 | type T1<const T> = T;  // Error
//!     :         ^^^^^
//!  51 | 
//!  52 | type T2 = <const T>(x: T) => T;
//!  53 | type T3 = { <const T>(x: T): T };
//!     `----
