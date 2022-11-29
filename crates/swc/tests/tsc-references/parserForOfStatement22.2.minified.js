//// [parserForOfStatement22.ts]
//! 
//!   x The left-hand side of a `for...of` statement may not be `async`
//!    ,-[1:1]
//!  1 | 
//!  2 | var async;
//!  3 | for (async of [1, 2]) {}
//!    :      ^^^^^
//!    `----
