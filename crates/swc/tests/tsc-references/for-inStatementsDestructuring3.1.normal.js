//// [for-inStatementsDestructuring3.ts]
//!   x The left-hand side of a 'for...in' statement cannot be a destructuring pattern
//!    ,-[2:1]
//!  1 | var a, b;
//!  2 | for ([a, b] in []) { }
//!    :      ^^^^^^
//!    `----
