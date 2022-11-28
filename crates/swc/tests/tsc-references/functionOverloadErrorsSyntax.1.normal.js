//// [functionOverloadErrorsSyntax.ts]
//! 
//!   x A rest parameter must be last in a parameter list
//!     ,-[7:1]
//!   7 | 
//!   8 | //Function overload signature with rest param followed by non-optional parameter
//!   9 | function fn5(x: string, ...y: any[], z: string);
//!     :                         ^^^^^^^^^^^
//!  10 | function fn5() { }
//!     `----
