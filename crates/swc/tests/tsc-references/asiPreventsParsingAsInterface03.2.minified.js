//// [asiPreventsParsingAsInterface03.ts]
//!   x `interface` cannot be used as an identifier in strict mode
//!    ,-[2:1]
//!  1 | 
//!  2 | var interface: number, I: string;
//!    :     ^^^^^^^^^
//!  3 | 
//!  4 | namespace n {
//!  5 |     interface   // This should be the identifier 'interface'
//!    `----
//!   x Expression expected
//!    ,-[5:1]
//!  2 | var interface: number, I: string;
//!  3 | 
//!  4 | namespace n {
//!  5 |     interface   // This should be the identifier 'interface'
//!    :     ^^^^^^^^^
//!  6 |     I           // This should be the identifier 'I'
//!  7 |     {}          // This should be a block body
//!  8 | }
//!    `----
