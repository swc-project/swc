//// [asiPreventsParsingAsInterface03.ts]
//! 
//!   x `interface` cannot be used as an identifier in strict mode
//!    ,-[1:1]
//!  1 | 
//!  2 | var interface: number, I: string;
//!    :     ^^^^^^^^^
//!  3 | 
//!  4 | namespace n {
//!    `----
//! 
//!   x Unexpected token `interface`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string,
//!   | regexp, ` for template literal, (, or an identifier
//!    ,-[3:1]
//!  3 | 
//!  4 | namespace n {
//!  5 |     interface   // This should be the identifier 'interface'
//!    :     ^^^^^^^^^
//!  6 |     I           // This should be the identifier 'I'
//!  7 |     {}          // This should be a block body
//!    `----
