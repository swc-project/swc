//// [asyncArrowFunction6_es2017.ts]
//! 
//!   x `await` cannot be used as an identifier in an async context
//!    ,-[1:1]
//!  1 | 
//!  2 | var foo = async (a = await): Promise<void> => {
//!    :                      ^^^^^
//!  3 | }
//!    `----
