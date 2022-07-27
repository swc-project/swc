//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 18 | var ResultIsBoolean1 = delete STRING;
//!    :                               ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 18 | var ResultIsBoolean1 = delete STRING;
//!    :                               ^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 19 | var ResultIsBoolean2 = delete STRING1;
//!    :                               ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 19 | var ResultIsBoolean2 = delete STRING1;
//!    :                               ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 22 | var ResultIsBoolean3 = delete "";
//!    :                               ^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 23 | var ResultIsBoolean4 = delete { x: "", y: "" };
//!    :                               ^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 24 | var ResultIsBoolean5 = delete { x: "", y: (s: string) => { return s; } };
//!    :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 30 | var ResultIsBoolean9 = delete foo();
//!    :                               ^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 31 | var ResultIsBoolean10 = delete A.foo();
//!    :                                ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 32 | var ResultIsBoolean11 = delete (STRING + STRING);
//!    :                                 ^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 33 | var ResultIsBoolean12 = delete STRING.charAt(0);
//!    :                                ^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 36 | var ResultIsBoolean13 = delete delete STRING;
//!    :                                       ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | var ResultIsBoolean13 = delete delete STRING;
//!    :                                       ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | var ResultIsBoolean13 = delete delete STRING;
//!    :                                ^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!    :                                               ^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!    :                                       ^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 37 | var ResultIsBoolean14 = delete delete delete (STRING + STRING);
//!    :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 40 | delete "";
//!    :        ^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 41 | delete STRING;
//!    :        ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 41 | delete STRING;
//!    :        ^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 42 | delete STRING1;
//!    :        ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 42 | delete STRING1;
//!    :        ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 43 | delete foo();
//!    :        ^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
