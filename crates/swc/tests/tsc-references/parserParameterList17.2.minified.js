//// [parserParameterList17.ts]
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[2:1]
//!  1 | class C {
//!  2 |    constructor(a = 4);
//!    :                ^^^^^
//!  3 |    constructor(a, b) { }
//!  4 | }
//!    `----
