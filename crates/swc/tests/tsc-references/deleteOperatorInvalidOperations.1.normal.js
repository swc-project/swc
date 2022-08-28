//// [deleteOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,----
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                    ^^^^^^
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                           ^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                          ^
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  8 | var BOOLEAN2 = delete ;
//!    :                       ^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  8 | var BOOLEAN2 = delete ;
//!    :                      ^
//!    `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,----
//!  13 | delete s;      //expect error
//!     :        ^
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,----
//!  13 | delete s;      //expect error
//!     :        ^
//!     `----
