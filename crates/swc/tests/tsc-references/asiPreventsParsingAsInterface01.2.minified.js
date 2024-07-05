//// [asiPreventsParsingAsInterface01.ts]
//!   x `interface` cannot be used as an identifier in strict mode
//!    ,-[2:1]
//!  1 | 
//!  2 | var interface: number, I: string;
//!    :     ^^^^^^^^^
//!  3 | 
//!  4 | interface   // This should be the identifier 'interface'
//!  5 | I           // This should be the identifier 'I'
//!    `----
//!   x Expression expected
//!    ,-[4:1]
//!  1 | 
//!  2 | var interface: number, I: string;
//!  3 | 
//!  4 | interface   // This should be the identifier 'interface'
//!    : ^^^^^^^^^
//!  5 | I           // This should be the identifier 'I'
//!  6 | {}          // This should be a block body
//!    `----
