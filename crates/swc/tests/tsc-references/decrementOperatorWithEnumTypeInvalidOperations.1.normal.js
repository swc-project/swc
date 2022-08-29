//// [decrementOperatorWithEnumTypeInvalidOperations.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  14 | var ResultIsNumber5 = --(ENUM["A"] + ENUM.B);
//!     :                         ^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  15 | var ResultIsNumber6 = (ENUM.A + ENUM["B"])--;
//!     :                       ^^^^^^^^^^^^^^^^^^^^
//!     `----
