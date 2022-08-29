//// [trailingCommasInFunctionParametersAndArguments.ts]
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,----
//!  6 | function f2(...args,) {}
//!    :                    ^
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,----
//!  9 | declare function f25(...args,): void;
//!    :                             ^
//!    `----
