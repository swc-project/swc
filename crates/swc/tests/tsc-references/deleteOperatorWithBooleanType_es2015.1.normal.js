//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 17 | var ResultIsBoolean1 = delete BOOLEAN;
//!    :                               ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 17 | var ResultIsBoolean1 = delete BOOLEAN;
//!    :                               ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 20 | var ResultIsBoolean2 = delete true;
//!    :                               ^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 21 | var ResultIsBoolean3 = delete { x: true, y: false };
//!    :                               ^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 26 | var ResultIsBoolean6 = delete foo();
//!    :                               ^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 27 | var ResultIsBoolean7 = delete A.foo();
//!    :                               ^^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!    :                                      ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!    :                                      ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!    :                               ^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 33 | delete true;
//!    :        ^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 34 | delete BOOLEAN;
//!    :        ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 34 | delete BOOLEAN;
//!    :        ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 35 | delete foo();
//!    :        ^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | delete true, false;
//!    :        ^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
