//// [parserEnum5.ts]
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | enum E2 { a, }
//!  2 | enum E3 { a: 1, }
//!    :            ^
//!  3 | enum E1 { a, b: 1, c, d: 2 = 3 }
//!    `----
//! 
//!   x An enum member cannot have a numeric name
//!    ,-[1:1]
//!  1 | enum E2 { a, }
//!  2 | enum E3 { a: 1, }
//!    :              ^
//!  3 | enum E1 { a, b: 1, c, d: 2 = 3 }
//!    `----
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | enum E2 { a, }
//!  2 | enum E3 { a: 1, }
//!  3 | enum E1 { a, b: 1, c, d: 2 = 3 }
//!    :               ^
//!    `----
//! 
//!   x An enum member cannot have a numeric name
//!    ,-[1:1]
//!  1 | enum E2 { a, }
//!  2 | enum E3 { a: 1, }
//!  3 | enum E1 { a, b: 1, c, d: 2 = 3 }
//!    :                 ^
//!    `----
//! 
//!   x Expected a semicolon
//!    ,-[1:1]
//!  1 | enum E2 { a, }
//!  2 | enum E3 { a: 1, }
//!  3 | enum E1 { a, b: 1, c, d: 2 = 3 }
//!    :                        ^
//!    `----
//! 
//!   x An enum member cannot have a numeric name
//!    ,-[1:1]
//!  1 | enum E2 { a, }
//!  2 | enum E3 { a: 1, }
//!  3 | enum E1 { a, b: 1, c, d: 2 = 3 }
//!    :                          ^
//!    `----
