//// [parser642331_1.ts]
//! 
//!   x `static` cannot be used as an identifier in strict mode
//!    ,-[1:1]
//!  1 | "use strict";
//!  2 | 
//!  3 | class test {
//!  4 |     constructor (static) { }
//!    :                  ^^^^^^
//!  5 | }
//!    `----
