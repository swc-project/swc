//// [awaitUsingDeclarationsInForOf.2.ts]
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,-[3:1]
//!  1 | 
//!  2 | async function main() {
//!  3 |     for (await using of of []) {
//!    :          ^^^^^^^^^^^
//!  4 |     }
//!  5 | }
//!    `----
//!   x Expression expected
//!    ,-[3:1]
//!  1 | 
//!  2 | async function main() {
//!  3 |     for (await using of of []) {
//!    :                             ^
//!  4 |     }
//!  5 | }
//!    `----
