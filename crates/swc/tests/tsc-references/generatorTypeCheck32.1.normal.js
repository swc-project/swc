//// [generatorTypeCheck32.ts]
//! 
//!   x Expression expected
//!    ,-[1:1]
//!  1 | var s: string;
//!  2 | var f: () => number = () => yield s;
//!    :                             ^^^^^
//!    `----
