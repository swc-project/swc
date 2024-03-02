//// [awaitUsingDeclarationsInForAwaitOf.ts]
//! 
//!   x Expected ';', got 'd1'
//!    ,-[1:1]
//!  1 | async function main() {
//!  2 |     for await (await using d1 of [{ async [Symbol.asyncDispose]() {} }, { [Symbol.dispose]() {} }, null, undefined]) {
//!    :                            ^^
//!  3 |     }
//!  4 | }
//!    `----
