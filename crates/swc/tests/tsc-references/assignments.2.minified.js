//// [assignments.ts]
//! 
//!   x cannot reassign to a class
//!     ,-[13:1]
//!  13 | class C { }
//!     :       |
//!     :       `-- class name
//!  14 | C = null; // Error
//!     : ^
//!     `----
