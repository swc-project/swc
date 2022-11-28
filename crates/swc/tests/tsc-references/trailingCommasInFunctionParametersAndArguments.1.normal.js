//// [trailingCommasInFunctionParametersAndArguments.ts]
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,-[4:1]
//!  4 | f1(1,);
//!  5 | 
//!  6 | function f2(...args,) {}
//!    :                    ^
//!  7 | 
//!  8 | // Allowed for ambient declarations
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!     ,-[7:1]
//!   7 | 
//!   8 | // Allowed for ambient declarations
//!   9 | declare function f25(...args,): void;
//!     :                             ^
//!  10 | 
//!  11 | f2(...[],);
//!     `----
