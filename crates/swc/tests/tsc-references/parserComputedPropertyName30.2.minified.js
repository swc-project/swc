//// [parserComputedPropertyName30.ts]
//! 
//!   x Computed property names are not allowed in enums
//!    ,-[1:1]
//!  1 | enum E {
//!  2 |     // no ASI, comma expected
//!  3 |     [e] = id++
//!    :     ^^
//!  4 |     [e2] = 1
//!  5 | }
//!    `----
//! 
//!   x Expected ',', got '['
//!    ,-[1:1]
//!  1 | enum E {
//!  2 |     // no ASI, comma expected
//!  3 |     [e] = id++
//!  4 |     [e2] = 1
//!    :     ^
//!  5 | }
//!    `----
//! 
//!   x Computed property names are not allowed in enums
//!    ,-[1:1]
//!  1 | enum E {
//!  2 |     // no ASI, comma expected
//!  3 |     [e] = id++
//!  4 |     [e2] = 1
//!    :     ^^^
//!  5 | }
//!    `----
