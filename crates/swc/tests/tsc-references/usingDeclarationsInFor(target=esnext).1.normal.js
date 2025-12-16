//// [usingDeclarationsInFor.ts]
//!   x Expected ';', got 'ident'
//!    ,-[2:1]
//!  1 | 
//!  2 | for (using d1 = { [Symbol.dispose]() {} }, d2 = null, d3 = undefined;;) {
//!    :            ^^
//!  3 | }
//!    `----
