//// [controlFlowDeleteOperator.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  15 | delete x;  // No effect
//!     :        ^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  15 | delete x;  // No effect
//!     :        ^
//!     `----
