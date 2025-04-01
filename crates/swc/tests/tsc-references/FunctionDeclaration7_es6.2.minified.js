//// [FunctionDeclaration7_es6.ts]
//!   x 'yield' cannot be used as a parameter within generator
//!    ,-[3:1]
//!  1 | function*bar() {
//!  2 |   // 'yield' here is an identifier, and not a yield expression.
//!  3 |   function*foo(a = yield) {
//!    :                    ^^^^^
//!  4 |   }
//!  5 | }
//!    `----
