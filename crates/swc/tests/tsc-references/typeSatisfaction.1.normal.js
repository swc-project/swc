//// [typeSatisfaction.ts]
//! 
//!   x Expected a semicolon
//!     ,----
//!  11 | const t1 = { a: 1 } satisfies I1; // Ok
//!     :                     ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  12 | const t2 = { a: 1, b: 1 } satisfies I1; // Error
//!     :                           ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  13 | const t3 = { } satisfies I1; // Error
//!     :                ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  15 | const t4: T1 = { a: "a" } satisfies T1; // Ok
//!     :                           ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  16 | const t5 = (m => m.substring(0)) satisfies T2; // Ok
//!     :                                  ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  18 | const t6 = [1, 2] satisfies [number, number];
//!     :                   ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  23 | let t7 = { a: 'test' } satisfies A;
//!     :                        ^^^^^^^^^
//!     `----
//! 
//!   x Expected a semicolon
//!     ,----
//!  24 | let t8 = { a: 'test', b: 'test' } satisfies A;
//!     :                                   ^^^^^^^^^
//!     `----
