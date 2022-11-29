//// [newOperatorErrorCases.ts]
//! 
//!   x Expected a semicolon
//!     ,-[24:1]
//!  24 | var nestedCtor: nestedCtor;
//!  25 | 
//!  26 | // Construct expression with no parentheses for construct signature with > 0 parameters
//!  27 | var b = new C0 32, ''; // Parse error
//!     :                ^^
//!  28 | 
//!  29 | // Generic construct expression with no parentheses
//!  30 | var c1 = new T;
//!     `----
