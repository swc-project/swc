//// [letIdentifierInElementAccess01.ts]
//! 
//!   x `let` cannot be used as an identifier in strict mode
//!    ,----
//!  1 | var let: any = {};
//!    :     ^^^
//!    `----
//! 
//!   x `let` cannot be used as an identifier in strict mode
//!    ,----
//!  2 | (let[0] = 100);
//!    :  ^^^
//!    `----
