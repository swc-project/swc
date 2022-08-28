//// [trailingCommasInBindingPatterns.ts]
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,----
//!  1 | const [...a,] = [];
//!    :            ^
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,----
//!  2 | const {...b,} = {};
//!    :            ^
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,----
//!  4 | ([...c,] = []);
//!    :       ^
//!    `----
//! 
//!   x Trailing comma isn't permitted after a rest element
//!    ,----
//!  5 | ({...d,} = {});
//!    :       ^
//!    `----
