//// [exponentiationOperatorWithInvalidSimpleUnaryExpressionOperands.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[26:1]
//!  26 | 1 ** (typeof temp--) ** 4;
//!  27 | 
//!  28 | (delete --temp) ** 3;
//!     :         ^^^^^^
//!  29 | (delete ++temp) ** 3;
//!  30 | (delete temp--) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[27:1]
//!  27 | 
//!  28 | (delete --temp) ** 3;
//!  29 | (delete ++temp) ** 3;
//!     :         ^^^^^^
//!  30 | (delete temp--) ** 3;
//!  31 | (delete temp++) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[28:1]
//!  28 | (delete --temp) ** 3;
//!  29 | (delete ++temp) ** 3;
//!  30 | (delete temp--) ** 3;
//!     :         ^^^^^^
//!  31 | (delete temp++) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[29:1]
//!  29 | (delete ++temp) ** 3;
//!  30 | (delete temp--) ** 3;
//!  31 | (delete temp++) ** 3;
//!     :         ^^^^^^
//!  32 | 
//!  33 | 1 ** (delete --temp) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[31:1]
//!  31 | (delete temp++) ** 3;
//!  32 | 
//!  33 | 1 ** (delete --temp) ** 3;
//!     :              ^^^^^^
//!  34 | 1 ** (delete ++temp) ** 3;
//!  35 | 1 ** (delete temp--) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[32:1]
//!  32 | 
//!  33 | 1 ** (delete --temp) ** 3;
//!  34 | 1 ** (delete ++temp) ** 3;
//!     :              ^^^^^^
//!  35 | 1 ** (delete temp--) ** 3;
//!  36 | 1 ** (delete temp++) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[33:1]
//!  33 | 1 ** (delete --temp) ** 3;
//!  34 | 1 ** (delete ++temp) ** 3;
//!  35 | 1 ** (delete temp--) ** 3;
//!     :              ^^^^^^
//!  36 | 1 ** (delete temp++) ** 3;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[34:1]
//!  34 | 1 ** (delete ++temp) ** 3;
//!  35 | 1 ** (delete temp--) ** 3;
//!  36 | 1 ** (delete temp++) ** 3;
//!     :              ^^^^^^
//!     `----
