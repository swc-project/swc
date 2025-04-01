//// [letIdentifierInElementAccess01.ts]
//!   x `let` cannot be used as an identifier in strict mode
//!    ,-[1:1]
//!  1 | var let: any = {};
//!    :     ^^^
//!  2 | (let[0] = 100);
//!    `----
//!   x `let` cannot be used as an identifier in strict mode
//!    ,-[2:1]
//!  1 | var let: any = {};
//!  2 | (let[0] = 100);
//!    :  ^^^
//!    `----
