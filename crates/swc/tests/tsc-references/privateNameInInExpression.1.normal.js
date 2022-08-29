//// [privateNameInInExpression.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  28 | for (#field in v) { /**/ } // Bad - 'in' not allowed
//!     :      ^^^^^^
//!     `----
