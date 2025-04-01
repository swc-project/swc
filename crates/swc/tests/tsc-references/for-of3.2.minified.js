//// [for-of3.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[2:1]
//!  1 | var v: any;
//!  2 | for (v++ of []) { }
//!    :      ^^^
//!    `----
