//// [logicalNotOperatorInvalidOperations.ts]
//! 
//!   x Expression expected
//!     ,-[8:1]
//!   8 | var BOOLEAN2 = !b + b;
//!   9 | 
//!  10 | // miss an operand
//!  11 | var BOOLEAN3 =!;
//!     :                ^
//!     `----
