//// [awaitUsingDeclarationsInForOf.1.ts]
//! 
//!   x Expected ';', got 'd1'
//!    ,-[1:1]
//!  1 | 
//!  2 | async function main() {
//!  3 |     for (await using d1 of [{ async [Symbol.asyncDispose]() {} }, { [Symbol.dispose]() {} }, null, undefined]) {
//!    :                      ^^
//!  4 |     }
//!  5 | }
//!    `----
