//// [validNullAssignments.ts]
//! 
//!   x cannot reassign to a class
//!     ,-[12:1]
//!  12 | class C { foo: string }
//!     :       |
//!     :       `-- class name
//!  13 | var f: C;
//!  14 | f = null; // ok
//!  15 | C = null; // error
//!     : ^
//!     `----
