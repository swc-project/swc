//// [parserComputedPropertyName26.ts]
//! 
//!   x Computed property names are not allowed in enums
//!    ,-[1:1]
//!  1 | enum E {
//!  2 |     // No ASI
//!  3 |     [e] = 0
//!    :     ^^
//!  4 |     [e2] = 1
//!  5 | }
//!    `----
