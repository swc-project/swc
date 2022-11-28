//// [deleteOperatorWithBooleanType.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[14:1]
//!  14 | var objA = new A();
//!  15 | 
//!  16 | // boolean type var
//!  17 | var ResultIsBoolean1 = delete BOOLEAN;
//!     :                               ^^^^^^^
//!  18 | 
//!  19 | // boolean type literal
//!  20 | var ResultIsBoolean2 = delete true;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[14:1]
//!  14 | var objA = new A();
//!  15 | 
//!  16 | // boolean type var
//!  17 | var ResultIsBoolean1 = delete BOOLEAN;
//!     :                               ^^^^^^^
//!  18 | 
//!  19 | // boolean type literal
//!  20 | var ResultIsBoolean2 = delete true;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[17:1]
//!  17 | var ResultIsBoolean1 = delete BOOLEAN;
//!  18 | 
//!  19 | // boolean type literal
//!  20 | var ResultIsBoolean2 = delete true;
//!     :                               ^^^^
//!  21 | var ResultIsBoolean3 = delete { x: true, y: false };
//!  22 | 
//!  23 | // boolean type expressions
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[19:1]
//!  19 | // boolean type literal
//!  20 | var ResultIsBoolean2 = delete true;
//!  21 | var ResultIsBoolean3 = delete { x: true, y: false };
//!     :                               ^^^^^^^^^^^^^^^^^^^^^
//!  22 | 
//!  23 | // boolean type expressions
//!  24 | var ResultIsBoolean4 = delete objA.a;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[23:1]
//!  23 | // boolean type expressions
//!  24 | var ResultIsBoolean4 = delete objA.a;
//!  25 | var ResultIsBoolean5 = delete M.n;
//!  26 | var ResultIsBoolean6 = delete foo();
//!     :                               ^^^^^
//!  27 | var ResultIsBoolean7 = delete A.foo();
//!  28 | 
//!  29 | // multiple delete  operator
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[24:1]
//!  24 | var ResultIsBoolean4 = delete objA.a;
//!  25 | var ResultIsBoolean5 = delete M.n;
//!  26 | var ResultIsBoolean6 = delete foo();
//!  27 | var ResultIsBoolean7 = delete A.foo();
//!     :                               ^^^^^^^
//!  28 | 
//!  29 | // multiple delete  operator
//!  30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[27:1]
//!  27 | var ResultIsBoolean7 = delete A.foo();
//!  28 | 
//!  29 | // multiple delete  operator
//!  30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!     :                                      ^^^^^^^
//!  31 | 
//!  32 | // miss assignment operators
//!  33 | delete true;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[27:1]
//!  27 | var ResultIsBoolean7 = delete A.foo();
//!  28 | 
//!  29 | // multiple delete  operator
//!  30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!     :                                      ^^^^^^^
//!  31 | 
//!  32 | // miss assignment operators
//!  33 | delete true;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[27:1]
//!  27 | var ResultIsBoolean7 = delete A.foo();
//!  28 | 
//!  29 | // multiple delete  operator
//!  30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!     :                               ^^^^^^^^^^^^^^
//!  31 | 
//!  32 | // miss assignment operators
//!  33 | delete true;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[30:1]
//!  30 | var ResultIsBoolean8 = delete delete BOOLEAN;
//!  31 | 
//!  32 | // miss assignment operators
//!  33 | delete true;
//!     :        ^^^^
//!  34 | delete BOOLEAN;
//!  35 | delete foo();
//!  36 | delete true, false;
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[32:1]
//!  32 | // miss assignment operators
//!  33 | delete true;
//!  34 | delete BOOLEAN;
//!     :        ^^^^^^^
//!  35 | delete foo();
//!  36 | delete true, false;
//!  37 | delete objA.a;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[32:1]
//!  32 | // miss assignment operators
//!  33 | delete true;
//!  34 | delete BOOLEAN;
//!     :        ^^^^^^^
//!  35 | delete foo();
//!  36 | delete true, false;
//!  37 | delete objA.a;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[32:1]
//!  32 | // miss assignment operators
//!  33 | delete true;
//!  34 | delete BOOLEAN;
//!  35 | delete foo();
//!     :        ^^^^^
//!  36 | delete true, false;
//!  37 | delete objA.a;
//!  38 | delete M.n;
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[33:1]
//!  33 | delete true;
//!  34 | delete BOOLEAN;
//!  35 | delete foo();
//!  36 | delete true, false;
//!     :        ^^^^
//!  37 | delete objA.a;
//!  38 | delete M.n;
//!     `----
