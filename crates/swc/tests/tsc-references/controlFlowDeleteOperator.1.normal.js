//// [controlFlowDeleteOperator.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[15:1]
//!  12 |     x.a;
//!  13 |     x.b;
//!  14 |     x;
//!  15 |     delete x;  // No effect
//!     :            ^
//!  16 |     x;
//!  17 | }
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[15:1]
//!  12 |     x.a;
//!  13 |     x.b;
//!  14 |     x;
//!  15 |     delete x;  // No effect
//!     :            ^
//!  16 |     x;
//!  17 | }
//!     `----
