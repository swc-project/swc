//// [invalidUndefinedAssignments.ts]
//! 
//!   x cannot reassign to a class
//!    ,-[7:1]
//!  7 | class C { foo: string }
//!    :       |
//!    :       `-- class name
//!  8 | var f: C;
//!  9 | C = x;
//!    : ^
//!    `----
