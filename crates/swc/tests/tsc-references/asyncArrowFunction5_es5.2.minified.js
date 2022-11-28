//// [asyncArrowFunction5_es5.ts]
//! 
//!   x `await` cannot be used as an identifier in an async context
//!    ,-[2:1]
//!  2 | var foo = async (await): Promise<void> => {
//!    :                  ^^^^^
//!  3 | }
//!    `----
