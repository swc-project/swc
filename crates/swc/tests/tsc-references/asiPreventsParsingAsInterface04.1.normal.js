//// [asiPreventsParsingAsInterface04.ts]
//!   x `interface` cannot be used as an identifier in strict mode
//!    ,-[2:1]
//!  1 | 
//!  2 | var declare: boolean, interface: number, I: string;
//!    :                       ^^^^^^^^^
//!  3 | 
//!  4 | declare     // This should be the identifier 'declare'
//!  5 | interface   // This should be the identifier 'interface'
//!    `----
