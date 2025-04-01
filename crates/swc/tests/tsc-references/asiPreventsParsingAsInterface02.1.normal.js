//// [asiPreventsParsingAsInterface02.ts]
//!   x `interface` cannot be used as an identifier in strict mode
//!    ,-[2:1]
//!  1 | 
//!  2 | function f(interface: number, I: string) {
//!    :            ^^^^^^^^^
//!  3 |     interface   // This should be the identifier 'interface'
//!  4 |     I           // This should be the identifier 'I'
//!  5 |     {}          // This should be a block body
//!    `----
//!   x Expression expected
//!    ,-[3:1]
//!  1 | 
//!  2 | function f(interface: number, I: string) {
//!  3 |     interface   // This should be the identifier 'interface'
//!    :     ^^^^^^^^^
//!  4 |     I           // This should be the identifier 'I'
//!  5 |     {}          // This should be a block body
//!  6 | }
//!    `----
