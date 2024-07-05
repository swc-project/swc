//// [parserParameterList14.ts]
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[2:1]
//!  1 | declare class C {
//!  2 |   foo(a = 1): void;
//!    :       ^^^^^
//!  3 | }
//!    `----
