//// [computedPropertyNames3_ES6.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//!  5 | get [delete id]() { }
//!    :             ^^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  5 | get [delete id]() { }
//!    :             ^^
//!    `----
