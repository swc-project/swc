//// [nullishCoalescingOperator5.ts]
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!    ,----
//!  7 | a ?? b || c;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,----
//!  10 | a || b ?? c;
//!     : ^^^^^^
//!     `----
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,----
//!  13 | a ?? b && c;
//!     :      ^^^^^^
//!     `----
//! 
//!   x Nullish coalescing operator(??) requires parens when mixing with logical operators
//!     ,----
//!  16 | a && b ?? c;
//!     : ^^^^^^
//!     `----
