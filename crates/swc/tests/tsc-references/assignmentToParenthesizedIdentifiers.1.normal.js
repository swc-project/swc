//// [assignmentToParenthesizedIdentifiers.ts]
//! 
//!   x cannot reassign to a class
//!     ,-[65:1]
//!  65 | class C {
//!     :       |
//!     :       `-- class name
//!  66 | 
//!  67 | }
//!  68 | 
//!  69 | C = undefined; // Error
//!     : ^
//!     `----
