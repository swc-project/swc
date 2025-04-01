//// [awaitUsingDeclarationsInForAwaitOf.2.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[5:1]
//!  2 | // https://github.com/microsoft/TypeScript/issues/55555
//!  3 | 
//!  4 | async function test() {
//!  5 |   for await (await using of of of) {};
//!    :              ^^^^^^^^^^^
//!  6 | }
//!    `----
//!   x Expected ')', got 'of'
//!    ,-[5:1]
//!  2 | // https://github.com/microsoft/TypeScript/issues/55555
//!  3 | 
//!  4 | async function test() {
//!  5 |   for await (await using of of of) {};
//!    :                                ^^
//!  6 | }
//!    `----
