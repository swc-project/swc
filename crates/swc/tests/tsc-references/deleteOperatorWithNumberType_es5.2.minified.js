//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 18 | var ResultIsBoolean1 = delete NUMBER;
//!    :                               ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 18 | var ResultIsBoolean1 = delete NUMBER;
//!    :                               ^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 19 | var ResultIsBoolean2 = delete NUMBER1;
//!    :                               ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 19 | var ResultIsBoolean2 = delete NUMBER1;
//!    :                               ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 22 | var ResultIsBoolean3 = delete 1;
//!    :                               ^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!    :                               ^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!    :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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
//! 32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!    :                                 ^^^^^^^^^^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 35 | var ResultIsBoolean12 = delete delete NUMBER;
//!    :                                       ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 35 | var ResultIsBoolean12 = delete delete NUMBER;
//!    :                                       ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 35 | var ResultIsBoolean12 = delete delete NUMBER;
//!    :                                ^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!    :                                               ^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!    :                                       ^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!    :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 39 | delete 1;
//!    :        ^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 40 | delete NUMBER;
//!    :        ^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 40 | delete NUMBER;
//!    :        ^^^^^^
//!    `----
//!
//!  x 'delete' cannot be called on an identifier in strict mode
//!    ,----
//! 41 | delete NUMBER1;
//!    :        ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 41 | delete NUMBER1;
//!    :        ^^^^^^^
//!    `----
//!
//!  x The operand of a delete operator must be a property reference.
//!    ,----
//! 42 | delete foo();
//!    :        ^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
