//// [reExportAliasMakesInstantiated.ts]
//!   x the name `test1` is defined multiple times
//!    ,-[2:1]
//!  1 | declare module pack1 {
//!  2 |   const test1: string;
//!    :         ^^|^^
//!    :           `-- previous definition of `test1` here
//!  3 |   export { test1 };
//!  4 | }
//!  5 | declare module pack2 {
//!  6 |   import test1 = pack1.test1;
//!    :          ^^|^^
//!    :            `-- `test1` redefined here
//!  7 |   export { test1 };
//!  8 | }
//!  9 | export import test1 = pack2.test1;
//!    `----
//!   x the name `test1` is defined multiple times
//!     ,-[6:1]
//!   3 |   export { test1 };
//!   4 | }
//!   5 | declare module pack2 {
//!   6 |   import test1 = pack1.test1;
//!     :          ^^|^^
//!     :            `-- previous definition of `test1` here
//!   7 |   export { test1 };
//!   8 | }
//!   9 | export import test1 = pack2.test1;
//!  10 | 
//!  11 | declare module mod1 {
//!  12 |   type test1 = string;
//!  13 |   export { test1 };
//!  14 | }
//!  15 | declare module mod2 {
//!  16 |   import test1 = mod1.test1;
//!     :          ^^|^^
//!     :            `-- `test1` redefined here
//!  17 |   export { test1 };
//!  18 | }
//!  19 | const test2 = mod2; // Possible false positive instantiation, but ok
//!     `----
