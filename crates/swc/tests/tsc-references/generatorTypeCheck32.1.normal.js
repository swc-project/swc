//// [generatorTypeCheck32.ts]
//! 
//!   x Unexpected token `yield`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp,
//!   | ` for template literal, (, or an identifier
//!    ,-[1:1]
//!  1 | var s: string;
//!  2 | var f: () => number = () => yield s;
//!    :                             ^^^^^
//!    `----
