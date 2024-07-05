//// [awaitUsingDeclarationsInFor.ts]
//!   x Expected ';', got 'd1'
//!    ,-[2:1]
//!  1 | async function main() {
//!  2 |     for (await using d1 = { [Symbol.dispose]() {} },
//!    :                      ^^
//!  3 |                     d2 = { async [Symbol.asyncDispose]() {} },
//!  4 |                     d3 = null,
//!  5 |                     d4 = undefined;;) {
//!    `----
