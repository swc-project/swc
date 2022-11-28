//// [controlFlowDeleteOperator.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[13:1]
//!  13 |     x.b;
//!  14 |     x;
//!  15 |     delete x;  // No effect
//!     :            ^
//!  16 |     x;
//!  17 | }
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[13:1]
//!  13 |     x.b;
//!  14 |     x;
//!  15 |     delete x;  // No effect
//!     :            ^
//!  16 |     x;
//!  17 | }
//!     `----
