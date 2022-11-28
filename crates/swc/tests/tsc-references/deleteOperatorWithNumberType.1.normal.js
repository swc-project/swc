//// [deleteOperatorWithNumberType.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[16:1]
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!     :                               ^^^^^^
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[16:1]
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!     :                               ^^^^^^
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[17:1]
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     :                               ^^^^^^^
//!  20 | 
//!  21 | // number type literal
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[17:1]
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     :                               ^^^^^^^
//!  20 | 
//!  21 | // number type literal
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[20:1]
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!     :                               ^
//!  23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!  24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[21:1]
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!  23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!     :                               ^^^^^^^^^^^^^
//!  24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[22:1]
//!  22 | var ResultIsBoolean3 = delete 1;
//!  23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!  24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!     :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  25 | 
//!  26 | // number type expressions
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[28:1]
//!  28 | var ResultIsBoolean7 = delete M.n;
//!  29 | var ResultIsBoolean8 = delete NUMBER1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!     :                               ^^^^^
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[29:1]
//!  29 | var ResultIsBoolean8 = delete NUMBER1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!     :                                ^^^^^^^
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[30:1]
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!     :                                 ^^^^^^^^^^^^^^^
//!  33 | 
//!  34 | // multiple delete  operator
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[33:1]
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                       ^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[33:1]
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                       ^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[33:1]
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                ^^^^^^^^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[34:1]
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     :                                               ^^^^^^^^^^^^^^^
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[34:1]
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     :                                       ^^^^^^^^^^^^^^^^^^^^^^^^
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[34:1]
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[37:1]
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!     :        ^
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[38:1]
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!     :        ^^^^^^
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[38:1]
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!     :        ^^^^^^
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[39:1]
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!     :        ^^^^^^^
//!  42 | delete foo();
//!  43 | delete objA.a;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[39:1]
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!     :        ^^^^^^^
//!  42 | delete foo();
//!  43 | delete objA.a;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[40:1]
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!     :        ^^^^^
//!  43 | delete objA.a;
//!  44 | delete M.n;
//!     `----
