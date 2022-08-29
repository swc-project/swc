//// [parserStrictMode15.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//!  2 | delete a;
//!    :        ^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  2 | delete a;
//!    :        ^
//!    `----
