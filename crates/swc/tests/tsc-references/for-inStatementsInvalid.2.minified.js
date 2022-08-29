//// [for-inStatementsInvalid.ts]
//! 
//!   x The left-hand side of a 'for...of' statement cannot use a type annotation
//!     ,----
//!  10 | for (var idx : number in {}) { }
//!     :          ^^^
//!     `----
