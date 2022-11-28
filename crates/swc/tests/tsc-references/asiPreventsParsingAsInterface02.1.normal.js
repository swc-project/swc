//// [asiPreventsParsingAsInterface02.ts]
//! 
//!   x `interface` cannot be used as an identifier in strict mode
//!    ,-[2:1]
//!  2 | function f(interface: number, I: string) {
//!    :            ^^^^^^^^^
//!  3 |     interface   // This should be the identifier 'interface'
//!  4 |     I           // This should be the identifier 'I'
//!  5 |     {}          // This should be a block body
//!    `----
//! 
//!   x Unexpected token `interface`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string,
//!   | regexp, ` for template literal, (, or an identifier
//!    ,-[2:1]
//!  2 | function f(interface: number, I: string) {
//!  3 |     interface   // This should be the identifier 'interface'
//!    :     ^^^^^^^^^
//!  4 |     I           // This should be the identifier 'I'
//!  5 |     {}          // This should be a block body
//!  6 | }
//!    `----
