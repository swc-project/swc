//// [parserForStatement7.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[1:1]
//!  1 | for (new foo() in b) {
//!    :      ^^^^^^^^^
//!  2 | }
//!    `----
