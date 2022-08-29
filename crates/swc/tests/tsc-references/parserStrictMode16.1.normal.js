//// [parserStrictMode16.ts]
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  2 | delete this;
//!    :        ^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  3 | delete 1;
//!    :        ^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  4 | delete null;
//!    :        ^^^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  5 | delete "a";
//!    :        ^^^
//!    `----
