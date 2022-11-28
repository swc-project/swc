//// [privateNameInInExpression.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,-[26:9]
//!  26 | const c = (#field) in v; // Bad - privateID is not an expression on its own
//!  27 | 
//!  28 |         for (#field in v) { /**/ } // Bad - 'in' not allowed
//!     :              ^^^^^^
//!  29 | 
//!  30 |         for (let d in #field in v) { /**/ } // Bad - rhs of in should be a object/any
//!  31 |     }
//!     `----
