//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 28 | (delete --temp) ** 3;
//!    :         ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 29 | (delete ++temp) ** 3;
//!    :         ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 30 | (delete temp--) ** 3;
//!    :         ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 31 | (delete temp++) ** 3;
//!    :         ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 33 | 1 ** (delete --temp) ** 3;
//!    :              ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 34 | 1 ** (delete ++temp) ** 3;
//!    :              ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 35 | 1 ** (delete temp--) ** 3;
//!    :              ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | 1 ** (delete temp++) ** 3;
//!    :              ^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
