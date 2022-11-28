//// [newOperatorErrorCases.ts]
//! 
//!   x Expected a semicolon
//!     ,-[25:1]
//!  25 | 
//!  26 | // Construct expression with no parentheses for construct signature with > 0 parameters
//!  27 | var b = new C0 32, ''; // Parse error
//!     :                ^^
//!  28 | 
//!  29 | // Generic construct expression with no parentheses
//!     `----
