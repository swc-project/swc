//// [deleteOperatorWithNumberType.ts]
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[18:1]
//!  15 | var objA = new A();
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!     :                               ^^^^^^
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!  20 | 
//!  21 | // number type literal
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[18:1]
//!  15 | var objA = new A();
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!     :                               ^^^^^^
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!  20 | 
//!  21 | // number type literal
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[19:1]
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     :                               ^^^^^^^
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[19:1]
//!  16 | 
//!  17 | // number type var
//!  18 | var ResultIsBoolean1 = delete NUMBER;
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!     :                               ^^^^^^^
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[22:1]
//!  19 | var ResultIsBoolean2 = delete NUMBER1;
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!     :                               ^
//!  23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!  24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[23:1]
//!  20 | 
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!  23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!     :                               ^^^^^^^^^^^^^
//!  24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!  25 | 
//!  26 | // number type expressions
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[24:1]
//!  21 | // number type literal
//!  22 | var ResultIsBoolean3 = delete 1;
//!  23 | var ResultIsBoolean4 = delete { x: 1, y: 2};
//!  24 | var ResultIsBoolean5 = delete { x: 1, y: (n: number) => { return n; } };
//!     :                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  25 | 
//!  26 | // number type expressions
//!  27 | var ResultIsBoolean6 = delete objA.a;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[30:1]
//!  27 | var ResultIsBoolean6 = delete objA.a;
//!  28 | var ResultIsBoolean7 = delete M.n;
//!  29 | var ResultIsBoolean8 = delete NUMBER1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!     :                               ^^^^^
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[31:1]
//!  28 | var ResultIsBoolean7 = delete M.n;
//!  29 | var ResultIsBoolean8 = delete NUMBER1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!     :                                ^^^^^^^
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!  33 | 
//!  34 | // multiple delete  operator
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[32:1]
//!  29 | var ResultIsBoolean8 = delete NUMBER1[0];
//!  30 | var ResultIsBoolean9 = delete foo();
//!  31 | var ResultIsBoolean10 = delete A.foo();
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!     :                                 ^^^^^^^^^^^^^^^
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[35:1]
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                       ^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[35:1]
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                       ^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[35:1]
//!  32 | var ResultIsBoolean11 = delete (NUMBER + NUMBER);
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!     :                                ^^^^^^^^^^^^^
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!  37 | 
//!  38 | // miss assignment operators
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[36:1]
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     :                                               ^^^^^^^^^^^^^^^
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[36:1]
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     :                                       ^^^^^^^^^^^^^^^^^^^^^^^^
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[36:1]
//!  33 | 
//!  34 | // multiple delete  operator
//!  35 | var ResultIsBoolean12 = delete delete NUMBER;
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!     :                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[39:1]
//!  36 | var ResultIsBoolean13 = delete delete delete (NUMBER + NUMBER);
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!     :        ^
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[40:1]
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!     :        ^^^^^^
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!  43 | delete objA.a;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[40:1]
//!  37 | 
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!     :        ^^^^^^
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!  43 | delete objA.a;
//!     `----
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[41:1]
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!     :        ^^^^^^^
//!  42 | delete foo();
//!  43 | delete objA.a;
//!  44 | delete M.n;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[41:1]
//!  38 | // miss assignment operators
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!     :        ^^^^^^^
//!  42 | delete foo();
//!  43 | delete objA.a;
//!  44 | delete M.n;
//!     `----
//!   x The operand of a delete operator must be a property reference.
//!     ,-[42:1]
//!  39 | delete 1;
//!  40 | delete NUMBER;
//!  41 | delete NUMBER1;
//!  42 | delete foo();
//!     :        ^^^^^
//!  43 | delete objA.a;
//!  44 | delete M.n;
//!  45 | delete objA.a, M.n;
//!     `----
