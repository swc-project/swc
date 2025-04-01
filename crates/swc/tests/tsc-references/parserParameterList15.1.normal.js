//// [parserParameterList15.ts]
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[1:1]
//!  1 | function foo(a = 4);
//!    :              ^^^^^
//!  2 | function foo(a, b) {}
//!    `----
